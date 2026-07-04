/* ============================================================
   Wanderlore — Gemini Client Singleton
   ============================================================ */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_MODEL } from './constants';

let genaiInstance: GoogleGenAI | null = null;

/** Get or create the Gemini client singleton. */
export function getGeminiClient(): GoogleGenAI {
  if (!genaiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured. Please set it in your environment variables.'
      );
    }
    genaiInstance = new GoogleGenAI({ apiKey });
  }
  return genaiInstance;
}

/** Generate content (non-streaming) and return parsed JSON or text. */
export async function generateContent(
  prompt: string,
  systemPrompt?: string,
  parseJson = true
): Promise<unknown> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      responseMimeType: parseJson ? 'application/json' : 'text/plain',
    },
  });

  const text = response.text ?? '';

  if (parseJson) {
    try {
      return JSON.parse(text);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1].trim());
      }
      throw new Error('Failed to parse AI response as JSON.');
    }
  }

  return text;
}

/** Generate streaming content and return a ReadableStream. */
export function generateStreamingContent(
  prompt: string,
  systemPrompt?: string
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const ai = getGeminiClient();

        const stream = await ai.models.generateContentStream({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
          },
        });

        for await (const chunk of stream) {
          const text = chunk.text ?? '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An unexpected error occurred.';
        controller.enqueue(encoder.encode(`\n\n[Error: ${message}]`));
        controller.close();
      }
    },
  });
}

/** Create an error response for API routes. */
export function createErrorResponse(
  message: string,
  status: number = 500
): Response {
  return Response.json(
    { error: 'Request failed', message, status },
    { status }
  );
}
