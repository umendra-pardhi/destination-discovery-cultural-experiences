import { NextRequest } from 'next/server';
import { generateContent, createErrorResponse } from '@/lib/gemini';
import { buildHiddenGemsPrompt } from '@/lib/prompts';
import { validateDestination, sanitizeInput } from '@/lib/validators';
import { createCacheKey, getFromCache, setInCache } from '@/lib/cache';
import type { HiddenGemsResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { destination = '', categories = [] } = body;

    // Validate input
    const destVal = validateDestination(destination);
    if (!destVal.valid) return createErrorResponse(destVal.error!, 400);

    const cleanDestination = sanitizeInput(destination);
    const cleanCategories = categories.map((cat: string) => sanitizeInput(cat));

    // Cache lookup
    const cacheKey = createCacheKey('hidden-gems', {
      destination: cleanDestination,
      categories: cleanCategories,
    });

    const cachedData = getFromCache<HiddenGemsResponse>(cacheKey);
    if (cachedData) {
      return Response.json(cachedData);
    }

    // Call Gemini
    const prompts = buildHiddenGemsPrompt(cleanDestination, cleanCategories);
    const result = await generateContent(prompts.user, prompts.system, true);

    // Cache response
    setInCache(cacheKey, result);

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`Hidden Gems API Error: ${msg}`, 500);
  }
}
