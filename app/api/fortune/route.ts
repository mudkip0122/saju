import { NextRequest, NextResponse } from 'next/server'
import { analyzeBirthInfo } from '@/lib/saju-calculator'
import { getGeminiConfig } from '@/lib/ai/config'
import { callGeminiFortune } from '@/lib/ai/gemini'
import { buildSajuPrompt } from '@/lib/ai/prompt'
import { assessFortuneQuality } from '@/lib/ai/quality'
import { checkFortuneRateLimit } from '@/lib/ai/rate-limit'
import {
  classifyProviderError,
  logFortuneEvent,
  type FortuneSource,
} from '@/lib/ai/telemetry'
import {
  fortuneRequestSchema,
  generateFallbackFortune,
  sanitizeFortuneResult,
} from '@/lib/schema'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const requestId = crypto.randomUUID()
  const clientIdentifier = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const rateLimit = checkFortuneRateLimit(clientIdentifier)
  if (!rateLimit.allowed) {
    logFortuneEvent({
      requestId,
      outcome: 'rate_limited',
      source: 'expert-fallback',
      durationMs: Date.now() - startedAt,
    })
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

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
    const geminiConfig = getGeminiConfig()
    const openaiKey = process.env.OPENAI_API_KEY

    let aiResult: unknown = null
    let source: FortuneSource = 'expert-fallback'
    let fallbackOutcome: 'provider_error' | 'parse_error' | null = null

    // LLM 호출 타임아웃 방어벽 (8.5초)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8500)

    try {
      if (geminiConfig) {
        const geminiResult = await callGeminiFortune(geminiConfig, calculated, controller.signal)
        const quality = assessFortuneQuality(geminiResult)
        if (!quality.passed) {
          throw new Error(`Gemini response failed quality checks: ${quality.reasons.join(',')}`)
        }
        aiResult = geminiResult
        source = 'gemini'
      } else if (openaiKey) {
        aiResult = await callOpenAILLM(openaiKey, calculated, controller.signal)
        source = 'openai'
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        clearTimeout(timeoutId)
        logFortuneEvent({
          requestId,
          outcome: 'timeout',
          source,
          durationMs: Date.now() - startedAt,
          model: geminiConfig?.model,
        })
        return NextResponse.json(
          { error: '분석 시간이 길어지고 있어요. 잠시 후 다시 시도해주세요.' },
          { status: 504 },
        )
      }
      fallbackOutcome = classifyProviderError(error)
      source = 'expert-fallback'
      console.warn('AI provider unavailable; using expert fallback engine.')
    } finally {
      clearTimeout(timeoutId)
    }

    // 3. AI 결과가 없거나 파싱 실패 시 고품질 지능형 사주 Fallback 엔진 가동
    const finalResult = aiResult
      ? sanitizeFortuneResult(aiResult, calculated)
      : generateFallbackFortune(calculated)

    logFortuneEvent({
      requestId,
      outcome: fallbackOutcome || 'success',
      source,
      durationMs: Date.now() - startedAt,
      model: source === 'gemini' ? geminiConfig?.model : undefined,
    })
    return NextResponse.json(finalResult, {
      status: 200,
      headers: { 'X-Fortune-Source': source, 'X-Request-Id': requestId },
    })
  } catch (error: unknown) {
    console.error('Unhandled fortune API error.')
    return NextResponse.json(
      { error: '분석에 실패했습니다. 다시 시도해주세요.' },
      { status: 500 },
    )
  }
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
