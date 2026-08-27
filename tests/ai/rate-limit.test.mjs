import assert from 'node:assert/strict'
import test from 'node:test'
import { checkFortuneRateLimit } from '../../lib/ai/rate-limit.ts'

test('allows ten requests per minute and then returns retry information', () => {
  const key = `test-${Date.now()}`
  const now = 1_000_000
  for (let index = 0; index < 10; index += 1) {
    assert.equal(checkFortuneRateLimit(key, now).allowed, true)
  }
  const limited = checkFortuneRateLimit(key, now)
  assert.equal(limited.allowed, false)
  assert.equal(limited.retryAfterSeconds, 60)
  assert.equal(checkFortuneRateLimit(key, now + 60_000).allowed, true)
})
