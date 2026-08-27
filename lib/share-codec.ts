import type { FortuneResult } from './mock-fortune'
import { formatKoreanDate, formatKoreanTime } from './mock-fortune'

/**
 * 초경량 직렬화용 축약 페이로드 타입
 */
interface CompactPayload {
  d: string // birthDate
  t?: string // birthTime
  u: 0 | 1 // unknownTime (0: false, 1: true)
  tn: string // typeName
  td: string // typeDescription
  z: [string, string] // zodiac [emoji, label]
  s: [string, string] // starSign [emoji, label]
  tr: [string, string][] // traits [[title, desc], ...]
  dt: [string, string, string][] // details [[emoji, title, desc], ...]
  ol: string // oneLiner
  to: [number, number, string, string[], string?] // today [score, max, message, keywords, action]
}

/**
 * UTF-8 안전 Base64URL 인코딩
 */
function utf8ToBase64Url(str: string): string {
  if (typeof Buffer !== 'undefined') {
    // `base64url` is not supported by every browser Buffer polyfill.
    // Encode as regular Base64 first, then apply the URL-safe alphabet.
    return Buffer.from(str, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i])
  }
  return btoa(bin)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * UTF-8 안전 Base64URL 디코딩
 */
function utf8FromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf8')
  }
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

/**
 * 사주 분석 결과 및 입력 데이터를 Base64URL 문자열로 직렬화 (DB-less)
 */
export function encodeSharePayload(
  result: FortuneResult,
  input: { birthDate: string; birthTime?: string; unknownTime: boolean },
): string {
  try {
    const compact: CompactPayload = {
      d: input.birthDate,
      t: input.unknownTime ? undefined : input.birthTime,
      u: input.unknownTime ? 1 : 0,
      tn: result.typeName,
      td: result.typeDescription,
      z: [result.zodiacAnimal.emoji, result.zodiacAnimal.label],
      s: [result.starSign.emoji, result.starSign.label],
      tr: result.traits.map((t) => [t.title, t.description]),
      dt: result.details.map((d) => [d.emoji, d.title, d.description]),
      ol: result.oneLiner,
      to: [
        result.today.score,
        result.today.max || 5,
        result.today.message,
        result.today.keywords || [],
        result.today.action,
      ],
    }

    const json = JSON.stringify(compact)
    return utf8ToBase64Url(json)
  } catch (error) {
    console.error('Failed to encode share payload:', error)
    return ''
  }
}

/**
 * Base64URL 문자열로부터 사주 분석 결과 및 입력 데이터 복원 (Hydration)
 * 손상되거나 유효하지 않은 데이터인 경우 null 반환 (E-16 대응)
 */
export function decodeSharePayload(encoded: string): {
  result: FortuneResult
  birthDate: string
  birthTime: string
  unknownTime: boolean
} | null {
  if (!encoded || typeof encoded !== 'string') return null

  try {
    const jsonStr = utf8FromBase64Url(encoded)
    const compact: CompactPayload = JSON.parse(jsonStr)

    // 필수 필드 유효성 검증
    if (
      !compact.d ||
      !compact.tn ||
      !Array.isArray(compact.z) ||
      !Array.isArray(compact.s) ||
      !Array.isArray(compact.tr) ||
      !Array.isArray(compact.dt) ||
      !compact.ol ||
      !Array.isArray(compact.to)
    ) {
      return null
    }

    const traits = compact.tr.slice(0, 3).map(([title, description]) => ({
      title: title || '성향',
      description: description || '',
    }))

    const details = compact.dt.slice(0, 3).map(([emoji, title, description]) => ({
      emoji: emoji || '✨',
      title: title || '특징',
      description: description || '',
    }))

    const result: FortuneResult = {
      typeName: compact.tn,
      typeDescription: compact.td || '',
      zodiacAnimal: { emoji: compact.z[0] || '✨', label: compact.z[1] || '띠' },
      starSign: { emoji: compact.s[0] || '⭐', label: compact.s[1] || '별자리' },
      traits,
      details,
      oneLiner: compact.ol,
      today: {
        score: Math.min(5, Math.max(1, Math.round(Number(compact.to[0]) || 4))),
        max: 5,
        message: compact.to[2] || '오늘 하루도 행복한 시간 보내세요.',
        keywords: Array.isArray(compact.to[3]) ? compact.to[3] : [],
        action: compact.to[4] || '미뤄둔 작은 일 하나를 10분만 시작해보세요.',
      },
    }

    return {
      result,
      birthDate: compact.d,
      birthTime: compact.t || '',
      unknownTime: Boolean(compact.u),
    }
  } catch (error) {
    console.warn('Failed to decode share payload, fallback to empty:', error)
    return null
  }
}

/**
 * 공유 URL 생성
 */
export function buildShareUrl(encodedPayload: string): string {
  if (typeof window === 'undefined') return ''
  const origin = window.location.origin
  const pathname = window.location.pathname
  const url = `${origin}${pathname}?res=${encodedPayload}`
  return url.length <= 2000 ? url : ''
}

/**
 * 텍스트 전문 복사용 요약문 (3단계 Fallback, E-16)
 */
export function formatShareText(
  result: FortuneResult,
  input: { birthDate: string; birthTime?: string; unknownTime: boolean },
): string {
  const birthInfo = `${formatKoreanDate(input.birthDate)} ${
    input.unknownTime ? '(시간 모름)' : formatKoreanTime(input.birthTime || '')
  }`

  const traits = result.traits.map((t) => `• ${t.title}: ${t.description}`).join('\n')
  const stars = '⭐'.repeat(result.today.score)

  return `[🔮 AI 사주·운세 분석 결과]
생년정보: ${birthInfo}
나의 타입: "${result.typeName}"
띠/별자리: ${result.zodiacAnimal.emoji} ${result.zodiacAnimal.label} · ${result.starSign.emoji} ${result.starSign.label}

[✨ 핵심 성향]
${traits}

[💬 한 줄 총평]
"${result.oneLiner}"

[⭐ 오늘의 운세 (${stars} ${result.today.score}/5점)]
${result.today.message}

[✅ 오늘의 작은 실천]
${result.today.action}
`
}
