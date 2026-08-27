import { NextRequest, NextResponse } from 'next/server'
import { analyzeBirthInfo } from '@/lib/saju-calculator'
import {
  fortuneRequestSchema,
  generateFallbackFortune,
  sanitizeFortuneResult,
} from '@/lib/schema'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null)
    if (!json) {
      return NextResponse.json(
        { error: '요청 본문이 올바르지 않습니다.' },
        { status: 400 },
      )
    }

    const parseResult = fortuneRequestSchema.safeParse(json)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: '올바른 생년월일과 시간을 입력해주세요.', details: parseResult.error.flatten() },
        { status: 400 },
      )
    }

    const { birthDate, birthTime, unknownTime } = parseResult.data

    // 1. 순수 계산 엔진으로 띠, 별자리, 사주 4주8자 판별
    const calculated = analyzeBirthInfo(birthDate, birthTime, unknownTime)

    // 2. AI LLM 연동 준비 (Gemini / OpenAI)
    const geminiKey = process.env.GEMINI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    let aiResult: any = null

    // LLM 호출 타임아웃 방어벽 (8.5초)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8500)

    try {
      if (geminiKey) {
        aiResult = await callGeminiLLM(geminiKey, calculated, controller.signal)
      } else if (openaiKey) {
        aiResult = await callOpenAILLM(openaiKey, calculated, controller.signal)
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        clearTimeout(timeoutId)
        return NextResponse.json(
          { error: '분석 시간이 길어지고 있어요. 잠시 후 다시 시도해주세요.' },
          { status: 504 },
        )
      }
      console.warn('AI LLM call failed or unavailable, fallback to expert engine:', err.message || err)
    } finally {
      clearTimeout(timeoutId)
    }

    // 3. AI 결과가 없거나 파싱 실패 시 고품질 지능형 사주 Fallback 엔진 가동
    const finalResult = aiResult
      ? sanitizeFortuneResult(aiResult, calculated)
      : generateFallbackFortune(calculated)

    return NextResponse.json(finalResult, { status: 200 })
  } catch (error: any) {
    console.error('Unhandled fortune API error:', error)
    return NextResponse.json(
      { error: '분석에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 },
    )
  }
}

/**
 * Gemini REST API 호출
 */
async function callGeminiLLM(
  apiKey: string,
  calculated: ReturnType<typeof analyzeBirthInfo>,
  signal: AbortSignal,
) {
  const prompt = buildSajuPrompt(calculated)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!rawText) throw new Error('Empty Gemini response')

  return JSON.parse(rawText)
}

/**
 * OpenAI Chat Completions API 호출
 */
async function callOpenAILLM(
  apiKey: string,
  calculated: ReturnType<typeof analyzeBirthInfo>,
  signal: AbortSignal,
) {
  const prompt = buildSajuPrompt(calculated)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal,
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 사주명리학과 점성술을 현대적이고 세련된 언어로 풀어내는 전문 AI 운세 분석가입니다. 반드시 요청된 순수 JSON 포맷으로만 응답해야 합니다.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const rawText = data?.choices?.[0]?.message?.content
  if (!rawText) throw new Error('Empty OpenAI response')

  return JSON.parse(rawText)
}

/**
 * 사주 & 별자리 종합 프롬프트 구성
 */
function buildSajuPrompt(calculated: ReturnType<typeof analyzeBirthInfo>) {
  const today = new Date()
  const todayStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`

  const sajuSummary = [
    `연주: ${calculated.saju.yearPillar.label}`,
    `월주: ${calculated.saju.monthPillar.label}`,
    `일주: ${calculated.saju.dayPillar.label}`,
    calculated.saju.timePillar ? `시주: ${calculated.saju.timePillar.label}` : '시주: 미상 (태어난 시간 모름)',
  ].join(', ')

  return `
다음 사용자의 사주 간지 및 별자리 정보를 종합 분석하여 현대적이고 통찰력 있는 사주 성향과 오늘의 운세를 작성해주세요.

[사용자 정보]
- 생년월일: ${calculated.year}년 ${calculated.month}월 ${calculated.day}일
- 태어난 시간: ${calculated.isUnknownTime ? '모름 (간략 분석)' : `${calculated.hour}시경`}
- 띠: ${calculated.zodiacAnimal.label} (${calculated.zodiacAnimal.element}의 기운)
- 별자리: ${calculated.starSign.label}
- 사주 4주/3주: ${sajuSummary}
- 오늘 기준일: ${todayStr}

[반드시 준수할 JSON 구조]
{
  "typeName": "세련되고 개성 있는 8~15자의 타입 이름 (예: 직관적 전략가형, 깊은 바다의 사색가형)",
  "typeDescription": "타입에 대한 2~3줄의 매력적이고 공감가는 성향 설명",
  "traits": [
    { "title": "핵심 성향 키워드 1 (예: 날카로운 통찰력)", "description": "해당 성향에 대한 한 줄 설명" },
    { "title": "핵심 성향 키워드 2", "description": "해당 성향에 대한 한 줄 설명" },
    { "title": "핵심 성향 키워드 3", "description": "해당 성향에 대한 한 줄 설명" }
  ],
  "details": [
    { "emoji": "✨", "title": "강점", "description": "이 사람의 가장 뛰어난 강점 1~2문장" },
    { "emoji": "🌙", "title": "주의할 점", "description": "살아가며 유의하면 좋은 점 1~2문장" },
    { "emoji": "💫", "title": "인간관계", "description": "대인관계 및 소통 스타일 1~2문장" }
  ],
  "oneLiner": "인생을 관통하는 멋진 한 줄 총평 요약문",
  "today": {
    "score": 1부터 5까지의 정수 (예: 4 또는 5),
    "message": "오늘 하루를 위한 따뜻하고 구체적인 조언 한 줄",
    "keywords": ["오늘의 키워드1", "키워드2", "키워드3"]
  }
}

주의:
1. traits 배열은 반드시 정확히 3개여야 합니다.
2. details 배열은 강점, 주의할 점, 인간관계 3개 항목이어야 합니다.
3. today.score는 1~5 정수여야 합니다.
4. 오직 위 JSON 포맷만 반환하세요.
`
}
