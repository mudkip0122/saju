import type { analyzeBirthInfo } from '@/lib/saju-calculator'

export const FORTUNE_PROMPT_VERSION = '2026-08-27.v1'

export function buildSajuPrompt(calculated: ReturnType<typeof analyzeBirthInfo>) {
  const today = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const sajuSummary = [
    `연주: ${calculated.saju.yearPillar.label}`,
    `월주: ${calculated.saju.monthPillar.label}`,
    `일주: ${calculated.saju.dayPillar.label}`,
    calculated.saju.timePillar
      ? `시주: ${calculated.saju.timePillar.label}`
      : '시주: 미상 (태어난 시간 모름)',
  ].join(', ')

  return `
다음 사용자의 사주 간지 및 별자리 정보를 종합 분석하여 현대적이고 통찰력 있는 사주 성향과 오늘의 운세를 작성해주세요.

[사용자 정보]
- 생년월일: ${calculated.year}년 ${calculated.month}월 ${calculated.day}일
- 태어난 시간: ${calculated.isUnknownTime ? '모름 (간략 분석)' : `${calculated.hour}시경`}
- 띠: ${calculated.zodiacAnimal.label} (${calculated.zodiacAnimal.element}의 기운)
- 별자리: ${calculated.starSign.label}
- 사주 4주/3주: ${sajuSummary}
- 오늘 기준일(KST): ${today}

[작성 원칙]
- 사용자가 공감할 수 있는 구체적이고 따뜻한 한국어를 사용하세요.
- 단정적 예언, 공포 조장, 의료·법률·재무 판단을 유도하는 표현을 피하세요.
- traits는 정확히 3개, details는 강점·주의할 점·인간관계 순서로 정확히 3개를 작성하세요.
- today.score는 1~5 사이 정수로 작성하세요.
- today.action은 오늘 바로 실행할 수 있는 짧고 구체적인 행동 한 가지로 작성하세요.
- JSON 외의 설명이나 코드펜스를 출력하지 마세요.
`
}
