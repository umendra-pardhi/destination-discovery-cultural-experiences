import { NextRequest } from 'next/server';
import { generateContent, createErrorResponse } from '@/lib/gemini';
import { buildHeritagePrompt } from '@/lib/prompts';
import { validateDestination, sanitizeInput } from '@/lib/validators';
import { createCacheKey, getFromCache, setInCache } from '@/lib/cache';
import type { HeritageResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { destination = '', siteName = '' } = body;

    // Validate inputs
    const destVal = validateDestination(destination);
    if (!destVal.valid) return createErrorResponse(destVal.error!, 400);

    const cleanDestination = sanitizeInput(destination);
    const cleanSiteName = sanitizeInput(siteName);

    // Cache lookup
    const cacheKey = createCacheKey('heritage', {
      destination: cleanDestination,
      siteName: cleanSiteName,
    });

    const cachedData = getFromCache<HeritageResponse>(cacheKey);
    if (cachedData) {
      return Response.json(cachedData);
    }

    // Call Gemini
    const prompts = buildHeritagePrompt(cleanDestination, cleanSiteName);
    const result = await generateContent(prompts.user, prompts.system, true);

    // Cache results
    setInCache(cacheKey, result);

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`Heritage Guide API Error: ${msg}`, 500);
  }
}
