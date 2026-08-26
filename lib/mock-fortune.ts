export type FortuneResult = {
  typeName: string
  typeDescription: string
  zodiacAnimal: { emoji: string; label: string }
  starSign: { emoji: string; label: string }
  traits: { title: string; description: string }[]
  details: { emoji: string; title: string; description: string }[]
  oneLiner: string
  today: {
    score: number
    max: number
    message: string
    keywords: string[]
  }
}

export const MOCK_RESULT: FortuneResult = {
  typeName: '차분한 전략가형',
  typeDescription:
    '신중하게 상황을 살피면서도 자신만의 방식으로 길을 만들어가는 타입',
  zodiacAnimal: { emoji: '🐑', label: '양띠' },
  starSign: { emoji: '♒', label: '물병자리' },
  traits: [
    { title: '신중함', description: '결정을 내리기 전 충분히 생각하는 편' },
    { title: '분석적', description: '상황을 구조적으로 파악하는 능력이 뛰어난 편' },
    { title: '독립적', description: '자신만의 기준과 방식이 뚜렷한 편' },
  ],
  details: [
    {
      emoji: '✨',
      title: '강점',
      description:
        '상황을 객관적으로 바라보고 계획적으로 행동하는 능력이 뛰어납니다.',
    },
    {
      emoji: '🌙',
      title: '주의할 점',
      description:
        '생각이 많아 결정이 늦어지거나 혼자 고민을 오래 끌고 갈 수 있습니다.',
    },
    {
      emoji: '💫',
      title: '인간관계',
      description:
        '많은 사람과 빠르게 친해지기보다는 신뢰할 수 있는 사람과 깊은 관계를 만드는 편입니다.',
    },
  ],
  oneLiner:
    '조용히 관찰하지만, 결정적인 순간에는 누구보다 명확하게 움직이는 사람.',
  today: {
    score: 4,
    max: 5,
    message:
      '새로운 시도를 시작하기 좋은 날이에요. 평소 미뤄두었던 일을 하나 꺼내보세요.',
    keywords: ['새로운 시작', '작은 실행', '기록'],
  },
}

export const MOCK_INPUT = {
  birthDate: '2003-01-22',
  birthTime: '03:36',
}

export function formatKoreanDate(value: string) {
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${Number(y)}년 ${Number(m)}월 ${Number(d)}일`
}

export function formatKoreanTime(value: string) {
  const [h, min] = value.split(':')
  if (!h || !min) return value
  return `${h}:${min}`
}

export function todayLabel() {
  const now = new Date()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${
    weekdays[now.getDay()]
  })`
}
