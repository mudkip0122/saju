import type { z } from 'zod'
import type { geminiFortuneSchema } from './response-schema'

type GeneratedFortune = z.infer<typeof geminiFortuneSchema>

const unsafePatterns = [
  /(?:질병|암|사망).*(?:확실|예정|예언)/,
  /(?:투자|주식|코인).*(?:보장|반드시|확실)/,
  /(?:법적|소송).*(?:승소|패소).*(?:확실|반드시)/,
]

export type QualityAssessment = {
  passed: boolean
  reasons: string[]
}

export function assessFortuneQuality(result: GeneratedFortune): QualityAssessment {
  const reasons: string[] = []
  const combinedText = [
    result.typeName,
    result.typeDescription,
    ...result.traits.flatMap((item) => [item.title, item.description]),
    ...result.details.flatMap((item) => [item.title, item.description]),
    result.oneLiner,
    result.today.message,
    result.today.action,
  ].join(' ')

  if (result.traits.length !== 3) reasons.push('traits_count')
  if (result.details.length !== 3) reasons.push('details_count')
  if (!Number.isInteger(result.today.score) || result.today.score < 1 || result.today.score > 5) {
    reasons.push('score_range')
  }
  if (unsafePatterns.some((pattern) => pattern.test(combinedText))) reasons.push('unsafe_claim')

  const traitTitles = result.traits.map((item) => item.title.trim())
  if (new Set(traitTitles).size !== traitTitles.length) reasons.push('duplicate_traits')
  if (combinedText.length < 120) reasons.push('insufficient_detail')

  return { passed: reasons.length === 0, reasons }
}
