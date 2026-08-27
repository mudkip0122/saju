import 'server-only'

import type { analyzeBirthInfo } from '@/lib/saju-calculator'
import type { GeminiConfig } from './config'
import { buildSajuPrompt } from './prompt'
import {
  geminiResponseJsonSchema,
  parseGeminiFortuneEnvelope,
} from './response-schema'

export async function callGeminiFortune(
  config: GeminiConfig,
  calculated: ReturnType<typeof analyzeBirthInfo>,
  signal: AbortSignal,
) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': config.apiKey,
    },
    signal,
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildSajuPrompt(calculated) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseJsonSchema: geminiResponseJsonSchema,
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
  }

  const data: unknown = await response.json()
  return parseGeminiFortuneEnvelope(data)
}
