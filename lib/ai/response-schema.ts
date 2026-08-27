import { z } from 'zod'

export const FORTUNE_SCHEMA_VERSION = '2026-08-27.v1'

const generatedItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
})

const generatedDetailSchema = generatedItemSchema.extend({ emoji: z.string().min(1) })

export const geminiFortuneSchema = z.object({
  typeName: z.string().min(1),
  typeDescription: z.string().min(1),
  traits: z.array(generatedItemSchema),
  details: z.array(generatedDetailSchema),
  oneLiner: z.string().min(1),
  today: z.object({
    score: z.number(),
    message: z.string().min(1),
    keywords: z.array(z.string()),
    action: z.string().min(1),
  }),
})

export const geminiResponseJsonSchema = {
  type: 'object',
  required: ['typeName', 'typeDescription', 'traits', 'details', 'oneLiner', 'today'],
  properties: {
    typeName: { type: 'string' },
    typeDescription: { type: 'string' },
    traits: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object', required: ['title', 'description'],
        properties: { title: { type: 'string' }, description: { type: 'string' } },
      },
    },
    details: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object', required: ['emoji', 'title', 'description'],
        properties: {
          emoji: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' },
        },
      },
    },
    oneLiner: { type: 'string' },
    today: {
      type: 'object', required: ['score', 'message', 'keywords', 'action'],
      properties: {
        score: { type: 'integer', minimum: 1, maximum: 5 },
        message: { type: 'string' },
        keywords: { type: 'array', maxItems: 3, items: { type: 'string' } },
        action: { type: 'string' },
      },
    },
  },
} as const

const geminiEnvelopeSchema = z.object({
  candidates: z.array(
    z.object({ content: z.object({ parts: z.array(z.object({ text: z.string() })) }) }),
  ),
})

export function parseGeminiFortuneEnvelope(data: unknown) {
  const envelope = geminiEnvelopeSchema.safeParse(data)
  const text = envelope.success ? envelope.data.candidates[0]?.content.parts[0]?.text : null
  if (!text) throw new Error('Gemini returned an empty response')

  const normalized = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
  const json: unknown = JSON.parse(normalized)
  const parsed = geminiFortuneSchema.safeParse(json)
  if (!parsed.success) throw new Error('Gemini response failed schema validation')
  return parsed.data
}
