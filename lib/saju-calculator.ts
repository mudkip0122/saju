/**
 * 사주(四柱), 12간지 띠(Zodiac Animal), 12궁 별자리(Star Sign) 계산 엔진
 */

export interface ZodiacAnimal {
  emoji: string
  name: string // e.g. "양", "쥐"
  label: string // e.g. "양띠", "쥐띠"
  element: '목' | '화' | '토' | '금' | '수'
}

export interface StarSign {
  emoji: string
  name: string // e.g. "물병자리"
  label: string // e.g. "물병자리"
  period: string // e.g. "01.20 ~ 02.18"
}

export interface SajuPillars {
  yearPillar: { gan: string; ji: string; label: string }
  monthPillar: { gan: string; ji: string; label: string }
  dayPillar: { gan: string; ji: string; label: string }
  timePillar?: { gan: string; ji: string; label: string }
}

const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const
const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const

const ZODIAC_ANIMALS: Record<
  string,
  { emoji: string; name: string; label: string; element: '목' | '화' | '토' | '금' | '수' }
> = {
  자: { emoji: '🐭', name: '쥐', label: '쥐띠', element: '수' },
  축: { emoji: '🐮', name: '소', label: '소띠', element: '토' },
  인: { emoji: '🐯', name: '호랑이', label: '호랑이띠', element: '목' },
  묘: { emoji: '🐰', name: '토끼', label: '토끼띠', element: '목' },
  진: { emoji: '🐲', name: '용', label: '용띠', element: '토' },
  사: { emoji: '🐍', name: '뱀', label: '뱀띠', element: '화' },
  오: { emoji: '🐴', name: '말', label: '말띠', element: '화' },
  미: { emoji: '🐑', name: '양', label: '양띠', element: '토' },
  신: { emoji: '🐵', name: '원숭이', label: '원숭이띠', element: '금' },
  유: { emoji: '🐔', name: '닭', label: '닭띠', element: '금' },
  술: { emoji: '🐶', name: '개', label: '개띠', element: '토' },
  해: { emoji: '🐷', name: '돼지', label: '돼지띠', element: '수' },
}

/**
 * 12간지 띠 계산 (입춘 양력 2월 4일 기준 절기 고려)
 */
export function calculateZodiacAnimal(year: number, month: number, day: number): ZodiacAnimal {
  // 입춘(통상 양력 2월 4일경) 이전 출생자는 이전 해의 간지로 판별
  let sajuYear = year
  if (month < 2 || (month === 2 && day < 4)) {
    sajuYear = year - 1
  }

  // 기준년도 4년 = 갑자년 (4 % 12 = 4 -> 자)
  // (year - 4) % 12
  const branchIndex = ((sajuYear - 4) % 12 + 12) % 12
  const branch = EARTHLY_BRANCHES[branchIndex]
  return ZODIAC_ANIMALS[branch]
}

/**
 * 서양 12궁 별자리 계산 (양력 월/일 기준)
 */
export function calculateStarSign(month: number, day: number): StarSign {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { emoji: '♒', name: '물병자리', label: '물병자리', period: '01.20 ~ 02.18' }
  }
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return { emoji: '♓', name: '물고기자리', label: '물고기자리', period: '02.19 ~ 03.20' }
  }
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { emoji: '♈', name: '양자리', label: '양자리', period: '03.21 ~ 04.19' }
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { emoji: '♉', name: '황소자리', label: '황소자리', period: '04.20 ~ 05.20' }
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
    return { emoji: '♊', name: '쌍둥이자리', label: '쌍둥이자리', period: '05.21 ~ 06.21' }
  }
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
    return { emoji: '♋', name: '게자리', label: '게자리', period: '06.22 ~ 07.22' }
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { emoji: '♌', name: '사자자리', label: '사자자리', period: '07.23 ~ 08.22' }
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { emoji: '♍', name: '처녀자리', label: '처녀자리', period: '08.23 ~ 09.22' }
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { emoji: '♎', name: '천칭자리', label: '천칭자리', period: '09.23 ~ 10.22' }
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { emoji: '♏', name: '전갈자리', label: '전갈자리', period: '10.23 ~ 11.21' }
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { emoji: '♐', name: '사수자리', label: '사수자리', period: '11.22 ~ 12.21' }
  }
  return { emoji: '♑', name: '염소자리', label: '염소자리', period: '12.22 ~ 01.19' }
}

/**
 * 사주 간지(천간지지) 기본 산출
 */
export function calculateSajuPillars(
  year: number,
  month: number,
  day: number,
  hour?: number,
): SajuPillars {
  // 1. 연주 (Year Pillar) - 입춘 기준
  let sajuYear = year
  if (month < 2 || (month === 2 && day < 4)) {
    sajuYear = year - 1
  }
  const yearStemIdx = ((sajuYear - 4) % 10 + 10) % 10
  const yearBranchIdx = ((sajuYear - 4) % 12 + 12) % 12
  const yearPillar = {
    gan: HEAVENLY_STEMS[yearStemIdx],
    ji: EARTHLY_BRANCHES[yearBranchIdx],
    label: `${HEAVENLY_STEMS[yearStemIdx]}${EARTHLY_BRANCHES[yearBranchIdx]}년`,
  }

  // 2. 일주 (Day Pillar) - 율리우스 적일(Julian Day) 기반 정확한 일진 계산
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045

  // JDN 기준 10간 12지
  const dayStemIdx = ((jdn + 9) % 10 + 10) % 10
  const dayBranchIdx = ((jdn + 1) % 12 + 12) % 12
  const dayPillar = {
    gan: HEAVENLY_STEMS[dayStemIdx],
    ji: EARTHLY_BRANCHES[dayBranchIdx],
    label: `${HEAVENLY_STEMS[dayStemIdx]}${EARTHLY_BRANCHES[dayBranchIdx]}일`,
  }

  // 3. 월주 (Month Pillar) - 연간에 따른 월간 조견
  const monthBranchIdx = (month + 1) % 12 // 대략적 월지 (2월: 인월)
  const monthStemBase = (yearStemIdx % 5) * 2 + 2 // 연간에 따른 인월의 천간
  const monthStemIdx = (monthStemBase + (month - 2 + 12) % 12) % 10
  const monthPillar = {
    gan: HEAVENLY_STEMS[monthStemIdx],
    ji: EARTHLY_BRANCHES[monthBranchIdx],
    label: `${HEAVENLY_STEMS[monthStemIdx]}${EARTHLY_BRANCHES[monthBranchIdx]}월`,
  }

  // 4. 시주 (Time Pillar)
  let timePillar: { gan: string; ji: string; label: string } | undefined
  if (hour !== undefined && hour >= 0 && hour <= 23) {
    // 23시~01시: 자시 (0), 01~03: 축시 (1), ...
    const timeBranchIdx = Math.floor(((hour + 1) % 24) / 2)
    const timeStemBase = (dayStemIdx % 5) * 2 // 일간에 따른 자시의 천간
    const timeStemIdx = (timeStemBase + timeBranchIdx) % 10
    timePillar = {
      gan: HEAVENLY_STEMS[timeStemIdx],
      ji: EARTHLY_BRANCHES[timeBranchIdx],
      label: `${HEAVENLY_STEMS[timeStemIdx]}${EARTHLY_BRANCHES[timeBranchIdx]}시`,
    }
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    timePillar,
  }
}

/**
 * 생년월일 및 시간 파싱 & 종합 계산
 */
export function analyzeBirthInfo(birthDateStr: string, birthTimeStr?: string, unknownTime?: boolean) {
  const [yearStr, monthStr, dayStr] = birthDateStr.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)

  let hour: number | undefined
  if (!unknownTime && birthTimeStr) {
    const [h] = birthTimeStr.split(':')
    hour = parseInt(h, 10)
  }

  const zodiacAnimal = calculateZodiacAnimal(year, month, day)
  const starSign = calculateStarSign(month, day)
  const saju = calculateSajuPillars(year, month, day, hour)

  return {
    year,
    month,
    day,
    hour,
    isUnknownTime: Boolean(unknownTime),
    zodiacAnimal,
    starSign,
    saju,
  }
}
