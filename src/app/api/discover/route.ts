import { NextRequest } from 'next/server';
import { generateContent, createErrorResponse } from '@/lib/gemini';
import { buildDiscoverPrompt } from '@/lib/prompts';
import { validateInterests, validateBudget, validateTravelStyle, sanitizeInput } from '@/lib/validators';
import { createCacheKey, getFromCache, setInCache } from '@/lib/cache';
import { isRateLimited } from '@/lib/rateLimit';
import type { DiscoverResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return createErrorResponse('Too many requests. Please try again in a minute.', 429);
    }

    const body = await req.json().catch(() => ({}));
    const { interests = [], travelStyle = 'solo', budget = 'moderate', duration = '7 days', region = '' } = body;

    // Validate inputs
    const interestsVal = validateInterests(interests);
    if (!interestsVal.valid) return createErrorResponse(interestsVal.error!, 400);

    const budgetVal = validateBudget(budget);
    if (!budgetVal.valid) return createErrorResponse(budgetVal.error!, 400);

    const travelStyleVal = validateTravelStyle(travelStyle);
    if (!travelStyleVal.valid) return createErrorResponse(travelStyleVal.error!, 400);

    const cleanRegion = sanitizeInput(region);
    const cleanDuration = sanitizeInput(duration);

    // Cache lookup
    const cacheKey = createCacheKey('discover', {
      interests,
      travelStyle,
      budget,
      duration: cleanDuration,
      region: cleanRegion,
    });

    const cachedData = getFromCache<DiscoverResponse>(cacheKey);
    if (cachedData) {
      return Response.json(cachedData);
    }

    // Call Gemini
    const prompts = buildDiscoverPrompt(interests, travelStyle, budget, cleanDuration, cleanRegion);
    const result = await generateContent(prompts.user, prompts.system, true);

    // Cache the result
    setInCache(cacheKey, result);

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`Destination Discovery API Error: ${msg}`, 500);
  }
}
