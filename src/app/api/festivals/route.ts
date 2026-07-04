import { NextRequest } from 'next/server';
import { generateContent, createErrorResponse } from '@/lib/gemini';
import { buildFestivalPrompt } from '@/lib/prompts';
import { validateDestination, sanitizeInput } from '@/lib/validators';
import { createCacheKey, getFromCache, setInCache } from '@/lib/cache';
import type { FestivalResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { destination = '', month = '' } = body;

    // Validate inputs
    const destVal = validateDestination(destination);
    if (!destVal.valid) return createErrorResponse(destVal.error!, 400);

    const cleanDestination = sanitizeInput(destination);
    const cleanMonth = sanitizeInput(month);

    // Cache lookup
    const cacheKey = createCacheKey('festivals', {
      destination: cleanDestination,
      month: cleanMonth,
    });

    const cachedData = getFromCache<FestivalResponse>(cacheKey);
    if (cachedData) {
      return Response.json(cachedData);
    }

    // Call Gemini
    const prompts = buildFestivalPrompt(cleanDestination, cleanMonth);
    const result = await generateContent(prompts.user, prompts.system, true);

    // Cache the result
    setInCache(cacheKey, result);

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`Festival Finder API Error: ${msg}`, 500);
  }
}
