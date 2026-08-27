import assert from 'node:assert/strict'
import test from 'node:test'
import { assessFortuneQuality } from '../../lib/ai/quality.ts'

const base = {
  typeName: '깊이 있는 전략가형',
  typeDescription: '상황을 세심하게 관찰하고 자신만의 기준으로 차분하게 방향을 정하는 사람입니다.',
  traits: [
    { title: '통찰력', description: '복잡한 상황에서도 중요한 맥락과 본질을 빠르게 파악합니다.' },
    { title: '신중함', description: '여러 가능성을 충분히 검토한 뒤 안정적인 결정을 내립니다.' },
    { title: '독립성', description: '주변 의견을 존중하면서도 자신의 가치와 기준을 지켜나갑니다.' },
  ],
  details: [
    { emoji: '✨', title: '강점', description: '정보를 구조화하고 현실적인 해결책을 만드는 능력이 좋습니다.' },
    { emoji: '🌙', title: '주의할 점', description: '생각이 길어질 때는 작은 행동부터 시작하면 흐름이 좋아집니다.' },
    { emoji: '💫', title: '인간관계', description: '넓은 관계보다 신뢰를 쌓을 수 있는 깊은 관계를 선호합니다.' },
  ],
  oneLiner: '조용한 관찰과 분명한 실행으로 자신의 길을 만드는 사람.',
  today: {
    score: 4,
    message: '미뤄둔 작은 결정을 행동으로 옮겨보세요.',
    keywords: ['집중', '실행'],
    action: '오늘 할 일을 한 줄로 적고 바로 시작해보세요.',
  },
}

test('well-formed helpful fortune passes quality gate', () => {
  assert.deepEqual(assessFortuneQuality(base), { passed: true, reasons: [] })
})

test('duplicate traits and unsafe deterministic claims are rejected', () => {
  const invalid = structuredClone(base)
  invalid.traits[1].title = invalid.traits[0].title
  invalid.today.message = '주식 투자는 반드시 수익을 보장합니다.'
  const assessment = assessFortuneQuality(invalid)
  assert.equal(assessment.passed, false)
  assert.ok(assessment.reasons.includes('duplicate_traits'))
  assert.ok(assessment.reasons.includes('unsafe_claim'))
})
