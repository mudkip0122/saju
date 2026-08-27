const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const buckets = new Map<string, { count: number; resetAt: number }>()

export function checkFortuneRateLimit(identifier: string, now = Date.now()) {
  const current = buckets.get(identifier)
  if (!current || current.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (current.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}
