import { NextRequest } from 'next/server';
import { generateStreamingContent, createErrorResponse } from '@/lib/gemini';
import { buildCompanionPrompt, buildCompanionSystemPrompt } from '@/lib/prompts';
import { validateChatMessage, sanitizeInput } from '@/lib/validators';
import { isRateLimited } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return createErrorResponse('Too many requests. Please try again in a minute.', 429);
    }

    const body = await req.json().catch(() => ({}));
    const { message = '', history = [] } = body;

    // Validate inputs
    const msgVal = validateChatMessage(message);
    if (!msgVal.valid) return createErrorResponse(msgVal.error!, 400);

    const cleanMessage = sanitizeInput(message);
    const cleanHistory = history.map((h: { role: string; content: string }) => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: sanitizeInput(h.content),
    }));

    // Call Gemini Stream
    const systemInstruction = buildCompanionSystemPrompt();
    const prompt = buildCompanionPrompt(cleanMessage, cleanHistory);
    const stream = generateStreamingContent(prompt, systemInstruction);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`AI Companion API Error: ${msg}`, 500);
  }
}
