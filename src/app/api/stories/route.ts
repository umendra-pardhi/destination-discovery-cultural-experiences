import { NextRequest } from 'next/server';
import { generateStreamingContent, createErrorResponse } from '@/lib/gemini';
import { buildStoryPrompt } from '@/lib/prompts';
import { validateDestination, validateStoryStyle, sanitizeInput } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { destination = '', style = 'modern', focusArea = '' } = body;

    // Validate inputs
    const destVal = validateDestination(destination);
    if (!destVal.valid) return createErrorResponse(destVal.error!, 400);

    const styleVal = validateStoryStyle(style);
    if (!styleVal.valid) return createErrorResponse(styleVal.error!, 400);

    const cleanDestination = sanitizeInput(destination);
    const cleanFocus = sanitizeInput(focusArea);

    const prompts = buildStoryPrompt(cleanDestination, style, cleanFocus);
    const stream = generateStreamingContent(prompts.user, prompts.system);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`Storytelling API Error: ${msg}`, 500);
  }
}
