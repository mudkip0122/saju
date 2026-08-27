import 'server-only'

import { z } from 'zod'

const aiEnvironmentSchema = z.object({
  GEMINI_API_KEY: z.string().trim().min(1).optional(),
  GEMINI_MODEL: z.string().trim().min(1).default('gemini-3.5-flash-lite'),
})

export type GeminiConfig = {
  apiKey: string
  model: string
}

export function getGeminiConfig(): GeminiConfig | null {
  const parsed = aiEnvironmentSchema.safeParse({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || undefined,
    GEMINI_MODEL: process.env.GEMINI_MODEL || undefined,
  })

  if (!parsed.success) {
    console.warn('Gemini configuration is invalid; the expert fallback engine will be used.')
    return null
  }

  if (!parsed.data.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not configured; the expert fallback engine will be used.')
    return null
  }

  return {
    apiKey: parsed.data.GEMINI_API_KEY,
    model: parsed.data.GEMINI_MODEL,
  }
}
