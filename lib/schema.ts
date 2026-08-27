import { z } from 'zod'
import type { SajuPillars, StarSign, ZodiacAnimal } from './saju-calculator'

// 1. 요청 스키마
export const fortuneRequestSchema = z.object({
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '생년월일 형식이 올바르지 않습니다.'),
  birthTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, '태어난 시간 형식이 올바르지 않습니다.')
    .optional()
    .or(z.literal('')),
  unknownTime: z.boolean().default(false),
})

export type FortuneRequest = z.infer<typeof fortuneRequestSchema>

// 2. 응답 스키마
export const traitItemSchema = z.object({
  title: z.string().min(1, '성향 제목은 필수입니다.'),
  description: z.string().min(1, '성향 설명은 필수입니다.'),
})

export const detailItemSchema = z.object({
  emoji: z.string().default('✨'),
  title: z.string().min(1, '상세 항목 제목은 필수입니다.'),
  description: z.string().min(1, '상세 항목 설명은 필수입니다.'),
})

export const todayFortuneSchema = z.object({
  score: z.number().int().min(1).max(5),
  max: z.number().default(5),
  message: z.string().min(1, '오늘의 운세 코멘트는 필수입니다.'),
  keywords: z.array(z.string()).default([]),
  action: z.string().default('미뤄둔 작은 일 하나를 10분만 시작해보세요.'),
})

export const fortuneResponseSchema = z.object({
  typeName: z.string().min(1, '타입 이름은 필수입니다.'),
  typeDescription: z.string().min(1, '타입 설명은 필수입니다.'),
  zodiacAnimal: z.object({
    emoji: z.string(),
    label: z.string(),
  }),
  starSign: z.object({
    emoji: z.string(),
    label: z.string(),
  }),
  traits: z.array(traitItemSchema),
  details: z.array(detailItemSchema),
  oneLiner: z.string().min(1, '한 줄 총평은 필수입니다.'),
  today: todayFortuneSchema,
})

export type FortuneResponse = z.infer<typeof fortuneResponseSchema>

/**
 * E-11, E-12, E-13 데이터 무결성 강제 보정 함수
 */
export function sanitizeFortuneResult(
  raw: any,
  calculated: {
    zodiacAnimal: ZodiacAnimal
    starSign: StarSign
    saju: SajuPillars
    isUnknownTime: boolean
  },
): FortuneResponse {
  // 기본 띠와 별자리는 계산 엔진의 정확한 값으로 보장
  const zodiacAnimal = {
    emoji: calculated.zodiacAnimal.emoji,
    label: calculated.zodiacAnimal.label,
  }
  const starSign = {
    emoji: calculated.starSign.emoji,
    label: calculated.starSign.label,
  }

  // 1. 타입명 및 설명 보정 (E-11)
  const typeName =
    typeof raw?.typeName === 'string' && raw.typeName.trim()
      ? raw.typeName.trim()
      : `${calculated.zodiacAnimal.element} 기운의 지혜로운 탐색가형`

  const typeDescription =
    typeof raw?.typeDescription === 'string' && raw.typeDescription.trim()
      ? raw.typeDescription.trim()
      : `${calculated.zodiacAnimal.label}의 진취성과 ${calculated.starSign.label}의 고유한 직관을 겸비하여 어떤 환경에서도 유연하게 길을 찾아가는 타입입니다.`

  // 2. 핵심 성향 엄격 3개 보정 (E-12)
  let traits: { title: string; description: string }[] = []
  if (Array.isArray(raw?.traits)) {
    traits = raw.traits
      .filter(
        (t: any) =>
          t &&
          typeof t.title === 'string' &&
          t.title.trim() &&
          typeof t.description === 'string' &&
          t.description.trim(),
      )
      .map((t: any) => ({
        title: t.title.trim(),
        description: t.description.trim(),
      }))
  }

  const defaultTraitPool: { title: string; description: string }[] = [
    {
      title: '깊은 통찰력',
      description: '사물의 이면을 꿰뚫어 보고 본질을 빠르게 파악합니다.',
    },
    {
      title: '유연한 적응력',
      description: '주변 상황 변화에 맞춰 유연하게 대처하는 기민함이 있습니다.',
    },
    {
      title: '단단한 중심',
      description: '자신만의 가치관과 기준을 지키며 흔들림 없이 나아갑니다.',
    },
    {
      title: '섬세한 직관',
      description: '감각적으로 기회를 포착하고 조화로운 선택을 내립니다.',
    },
  ]

  // 3개 미만이면 기본 풀에서 채우고, 3개 초과면 3개로 자름
  if (traits.length < 3) {
    for (const fallback of defaultTraitPool) {
      if (traits.length >= 3) break
      if (!traits.some((t) => t.title === fallback.title)) {
        traits.push(fallback)
      }
    }
  }
  traits = traits.slice(0, 3)

  // 3. 상세 항목 (강점, 주의할 점, 인간관계) 보정 (E-11)
  const detailTitles = ['강점', '주의할 점', '인간관계']
  const detailEmojis = ['✨', '🌙', '💫']
  const defaultDetailDesc = [
    '자신만의 독창적인 시각으로 문제를 해결하고 주변을 긍정적으로 이끄는 힘이 있습니다.',
    '지나친 완벽주의로 스스로에게 부담을 줄 수 있으니 가벼운 마음을 갖는 것이 좋습니다.',
    '깊고 진정성 있는 관계를 소중히 여기며, 한번 맺은 인연에 신뢰를 다합니다.',
  ]

  let details: { emoji: string; title: string; description: string }[] = []
  if (Array.isArray(raw?.details)) {
    details = raw.details
      .filter((d: any) => d && typeof d.title === 'string')
      .map((d: any, idx: number) => ({
        emoji: typeof d.emoji === 'string' && d.emoji.trim() ? d.emoji.trim() : (detailEmojis[idx] || '✨'),
        title: d.title.trim() || detailTitles[idx] || '특징',
        description:
          typeof d.description === 'string' && d.description.trim()
            ? d.description.trim()
            : defaultDetailDesc[idx] || '균형 잡힌 성향을 나타냅니다.',
      }))
  }

  // 필수 3대 영역(강점, 주의점, 인간관계) 구조 유지
  if (details.length < 3) {
    for (let i = details.length; i < 3; i++) {
      details.push({
        emoji: detailEmojis[i],
        title: detailTitles[i],
        description: defaultDetailDesc[i],
      })
    }
  }
  details = details.slice(0, 3)

  // 4. 한 줄 총평 보정 (E-11)
  const oneLiner =
    typeof raw?.oneLiner === 'string' && raw.oneLiner.trim()
      ? raw.oneLiner.trim()
      : '조용히 흐르는 물처럼 유연하지만, 원하는 목표를 향해 끝까지 나아가는 단단한 사람.'

  // 5. 오늘의 운세 별점 1~5 정수 보정 (E-13)
  let rawScore = Number(raw?.today?.score)
  if (isNaN(rawScore)) {
    rawScore = 4
  }
  const score = Math.min(5, Math.max(1, Math.round(rawScore)))

  const message =
    typeof raw?.today?.message === 'string' && raw.today.message.trim()
      ? raw.today.message.trim()
      : '새로운 기운이 깃드는 날입니다. 마음에 담아두었던 작은 계획을 실행해보세요.'

  let keywords: string[] = []
  if (Array.isArray(raw?.today?.keywords)) {
    keywords = raw.today.keywords
      .filter((k: any) => typeof k === 'string' && k.trim())
      .map((k: any) => k.trim())
      .slice(0, 3)
  }
  if (keywords.length === 0) {
    keywords = ['행운의 흐름', '마음의 여유', '작은 도전']
  }

  const action =
    typeof raw?.today?.action === 'string' && raw.today.action.trim()
      ? raw.today.action.trim()
      : '미뤄둔 작은 일 하나를 10분만 시작해보세요.'

  return {
    typeName,
    typeDescription,
    zodiacAnimal,
    starSign,
    traits,
    details,
    oneLiner,
    today: {
      score,
      max: 5,
      message,
      keywords,
      action,
    },
  }
}

/**
 * AI 장애 또는 오프라인 시 사주 오행 알고리즘 기반 지능형 Fallback 생성
 */
export function generateFallbackFortune(calculated: {
  year: number
  month: number
  day: number
  hour?: number
  isUnknownTime: boolean
  zodiacAnimal: ZodiacAnimal
  starSign: StarSign
  saju: SajuPillars
}): FortuneResponse {
  const element = calculated.zodiacAnimal.element
  const dayGan = calculated.saju.dayPillar.gan

  // 오행별 맞춤 성향 풀
  const elementArchetypes: Record<
    string,
    {
      typeName: string
      typeDescription: string
      traits: { title: string; description: string }[]
      details: { emoji: string; title: string; description: string }[]
      oneLiner: string
    }
  > = {
    목: {
      typeName: '성장하는 개척자형',
      typeDescription:
        '새로운 가능성을 향해 곧게 뻗어나가는 나무처럼, 끊임없는 호기심과 발전 의지를 지닌 타입입니다.',
      traits: [
        { title: '진취적 실행력', description: '생각에만 머물지 않고 능동적으로 새로운 길을 열어갑니다.' },
        { title: '따뜻한 포용력', description: '주변 사람들의 성장을 진심으로 응원하고 지지합니다.' },
        { title: '정직한 신념', description: '자신이 옳다고 믿는 가치를 뚝심 있게 지켜나갑니다.' },
      ],
      details: [
        { emoji: '🌱', title: '강점', description: '어려운 환경에서도 새로운 기회를 찾아내고 빠르게 뿌리내립니다.' },
        { emoji: '🌙', title: '주의할 점', description: '지나치게 앞으로만 달리다 보면 번아웃이 올 수 있으니 완급 조절이 필요합니다.' },
        { emoji: '💫', title: '인간관계', description: '신뢰와 정을 바탕으로 오랜 시간 함께 성장하는 동반자적 관계를 선호합니다.' },
      ],
      oneLiner: '봄날의 새싹처럼 늘 푸른 열정으로 자신만의 계절을 만들어가는 사람.',
    },
    화: {
      typeName: '열정적인 영감가형',
      typeDescription:
        '밝게 타오르는 불꽃처럼 주변을 환하게 밝히며, 독창적인 직관과 매력으로 에너지를 전파하는 타입입니다.',
      traits: [
        { title: '폭발적 집중력', description: '마음이 움직이는 일에는 몰입하여 단숨에 성과를 이끌어냅니다.' },
        { title: '솔직한 표현력', description: '자신의 감정과 아이디어를 주저 없이 명쾌하게 전달합니다.' },
        { title: '창의적 직관', description: '틀에 얽매이지 않고 번뜩이는 영감으로 문제를 돌파합니다.' },
      ],
      details: [
        { emoji: '🔥', title: '강점', description: '탁월한 표현력과 친화력으로 분위기를 이끌고 사람들을 모으는 힘이 있습니다.' },
        { emoji: '🌙', title: '주의할 점', description: '기분에 따라 에너지 기복이 생길 수 있으니 감정의 평정을 유지하는 연습이 좋습니다.' },
        { emoji: '💫', title: '인간관계', description: '솔직담백하고 뒤끝 없는 소통으로 주변에 활력을 불어넣습니다.' },
      ],
      oneLiner: '어둠을 밝히는 등불처럼, 주변에 영감과 용기를 불어넣는 따뜻한 불꽃 같은 사람.',
    },
    토: {
      typeName: '신뢰의 중재자형',
      typeDescription:
        '넓은 대지처럼 묵묵하고 단단하게 모든 것을 품어내며, 안정감과 균형 감각이 뛰어난 타입입니다.',
      traits: [
        { title: '묵직한 안정감', description: '위기 상황에서도 당황하지 않고 차분하게 중심을 잡습니다.' },
        { title: '세심한 배려', description: '보이지 않는 곳에서도 타인을 챙기며 조화를 만들어냅니다.' },
        { title: '탁월한 신뢰성', description: '한번 약속한 일은 끝까지 책임지고 지켜냅니다.' },
      ],
      details: [
        { emoji: '⛰️', title: '강점', description: '모든 사람의 의견을 경청하고 가장 조화로운 해결책을 찾아냅니다.' },
        { emoji: '🌙', title: '주의할 점', description: '변화를 두려워하거나 속마음을 혼자 삭이지 않도록 표현하는 것이 좋습니다.' },
        { emoji: '💫', title: '인간관계', description: '오래될수록 깊은 맛이 나는 차처럼, 시간이 지날수록 더 큰 믿음을 줍니다.' },
      ],
      oneLiner: '대지처럼 든든하고 포근하여 곁에 있는 것만으로도 큰 위로가 되는 사람.',
    },
    금: {
      typeName: '명철한 전략가형',
      typeDescription:
        '단단한 원석과 날카로운 보검처럼, 명확한 기준과 냉철한 판단력으로 완성도 높은 결과를 빚어내는 타입입니다.',
      traits: [
        { title: '날카로운 분석력', description: '복잡한 문제의 핵심을 짚어내고 군더더기를 없앱니다.' },
        { title: '철저한 결단력', description: '중요한 갈림길에서 결단력 있게 행동합니다.' },
        { title: '높은 완성도', description: '스스로의 기준을 높게 두고 철저하게 목표를 달성합니다.' },
      ],
      details: [
        { emoji: '💎', title: '강점', description: '원칙과 실용성을 겸비하여 가장 효율적인 길을 설계합니다.' },
        { emoji: '🌙', title: '주의할 점', description: '지나치게 엄격한 기준은 자신과 타인을 지치게 할 수 있으니 유연함이 필요합니다.' },
        { emoji: '💫', title: '인간관계', description: '겉은 담백해 보이지만 속정이 깊고 의리를 지키는 진국 같은 관계를 맺습니다.' },
      ],
      oneLiner: '칼날 같은 명철함 속에 따뜻한 의리를 품은 지혜로운 설계자.',
    },
    수: {
      typeName: '깊이 있는 사유가형',
      typeDescription:
        '깊은 바다와 자유로운 물처럼, 풍부한 지혜와 탁월한 적응력으로 세상의 흐름을 읽어내는 타입입니다.',
      traits: [
        { title: '유연한 사고', description: '어떤 그릇에도 담기는 물처럼 상황에 부드럽게 대처합니다.' },
        { title: '심도 있는 통찰', description: '눈에 보이는 것 너머의 본질과 흐름을 읽어내는 능력이 있습니다.' },
        { title: '조용한 카리스마', description: '요란하지 않아도 차분하게 자신의 영역을 확립합니다.' },
      ],
      details: [
        { emoji: '🌊', title: '강점', description: '정보를 종합하고 맥락을 짚어내는 직관과 통찰력이 매우 뛰어납니다.' },
        { emoji: '🌙', title: '주의할 점', description: '생각이 꼬리를 물어 결정을 미루지 않도록 작은 것부터 바로 실행해보세요.' },
        { emoji: '💫', title: '인간관계', description: '편안하고 자연스러운 대화로 상대방의 마음을 무장해제시키는 매력이 있습니다.' },
      ],
      oneLiner: '깊은 호수처럼 맑고 고요하지만, 결코 마르지 않는 지혜의 샘을 품은 사람.',
    },
  }

  const archetype = elementArchetypes[element] || elementArchetypes['수']

  // 오늘 날짜 기준 동적 운세 점수 산출
  const today = new Date()
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const birthSeed = calculated.year * 1000 + calculated.month * 50 + calculated.day
  const pseudoRandomScore = 3 + ((dateSeed + birthSeed) % 3) // 3 ~ 5점 사이 긍정적 점수

  const todayMessages = [
    '주변의 기운이 나를 돕는 하루입니다. 주저했던 일에 용기를 내보세요.',
    '생각지 못한 작은 행운이 찾아옵니다. 마음의 여유를 갖고 하루를 즐기세요.',
    '자신만의 속도로 차분하게 걸어가면 기대 이상의 결과를 얻을 수 있는 날입니다.',
    '명확한 집중력이 발휘되는 날이에요. 중요한 결정을 내리기에 아주 좋습니다.',
  ]
  const chosenMessage = todayMessages[(dateSeed + calculated.day) % todayMessages.length]

  return sanitizeFortuneResult(
    {
      typeName: `${calculated.starSign.label}의 감성을 품은 ${archetype.typeName}`,
      typeDescription: `${calculated.zodiacAnimal.label}의 ${calculated.zodiacAnimal.element} 기운과 ${calculated.starSign.label}의 기질이 어우러져, ${archetype.typeDescription}`,
      traits: archetype.traits,
      details: archetype.details,
      oneLiner: archetype.oneLiner,
      today: {
        score: pseudoRandomScore,
        max: 5,
        message: chosenMessage,
        keywords: [calculated.zodiacAnimal.element + '의 기운', '직관적 실행', '행운의 조화'],
      },
    },
    calculated,
  )
}
