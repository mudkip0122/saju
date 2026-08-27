import 'server-only'

export type FortuneSource = 'gemini' | 'openai' | 'expert-fallback'
export type FortuneOutcome = 'success' | 'timeout' | 'provider_error' | 'parse_error' | 'rate_limited'

export function logFortuneEvent(event: {
  requestId: string
  outcome: FortuneOutcome
  source: FortuneSource
  durationMs: number
  model?: string
}) {
  console.info(JSON.stringify({ event: 'fortune_analysis', ...event }))
}

export function classifyProviderError(error: unknown): 'provider_error' | 'parse_error' {
  const message = error instanceof Error ? error.message : ''
  return /JSON|schema|empty response|quality checks/i.test(message)
    ? 'parse_error'
    : 'provider_error'
}
