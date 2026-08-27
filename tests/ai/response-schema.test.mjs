import assert from 'node:assert/strict'
import test from 'node:test'
import { geminiFortuneSchema, parseGeminiFortuneEnvelope } from '../../lib/ai/response-schema.ts'

const validFortune = {
  typeName: '차분한 전략가형',
  typeDescription: '깊이 생각하고 명확하게 움직이는 사람입니다.',
  traits: [
    { title: '통찰력', description: '본질을 빠르게 파악합니다.' },
    { title: '신중함', description: '충분히 검토한 뒤 결정합니다.' },
    { title: '독립성', description: '자신의 기준을 지킵니다.' },
  ],
  details: [
    { emoji: '✨', title: '강점', description: '복잡한 문제를 정리합니다.' },
    { emoji: '🌙', title: '주의할 점', description: '생각을 오래 끌지 마세요.' },
    { emoji: '💫', title: '인간관계', description: '깊은 신뢰를 중시합니다.' },
  ],
  oneLiner: '조용하지만 분명하게 길을 만드는 사람.',
  today: {
    score: 4,
    message: '작은 결정을 실행해보세요.',
    keywords: ['실행', '집중'],
    action: '미뤄둔 일 하나를 10분만 시작해보세요.',
  },
}

function envelope(text) {
  return { candidates: [{ content: { parts: [{ text }] } }] }
}

test('valid structured Gemini output is accepted', () => {
  const parsed = parseGeminiFortuneEnvelope(envelope(JSON.stringify(validFortune)))
  assert.equal(parsed.traits.length, 3)
  assert.equal(parsed.today.score, 4)
})

test('JSON code fences are normalized', () => {
  const fencedJson = '```json\n' + JSON.stringify(validFortune) + '\n```'
  const parsed = parseGeminiFortuneEnvelope(envelope(fencedJson))
  assert.equal(parsed.typeName, validFortune.typeName)
})

test('empty candidates and missing required fields are rejected', () => {
  assert.throws(() => parseGeminiFortuneEnvelope({ candidates: [] }), /empty response/)
  assert.throws(
    () => parseGeminiFortuneEnvelope(envelope(JSON.stringify({ typeName: '불완전' }))),
    /schema validation/,
  )
})

test('invalid score types are rejected before sanitization', () => {
  const invalid = structuredClone(validFortune)
  invalid.today.score = 'five'
  assert.equal(geminiFortuneSchema.safeParse(invalid).success, false)
})
