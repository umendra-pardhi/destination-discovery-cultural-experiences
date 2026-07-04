import { NextRequest } from 'next/server';
import { generateContent, createErrorResponse } from '@/lib/gemini';
import { buildItineraryPrompt } from '@/lib/prompts';
import {
  validateDestination,
  validateDays,
  validateInterests,
  validateBudget,
  validateTravelStyle,
  sanitizeInput,
} from '@/lib/validators';
import { createCacheKey, getFromCache, setInCache } from '@/lib/cache';
import type { ItineraryResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { destination = '', days = 3, interests = [], budget = 'moderate', travelStyle = 'solo' } = body;

    // Validate inputs
    const destVal = validateDestination(destination);
    if (!destVal.valid) return createErrorResponse(destVal.error!, 400);

    const daysVal = validateDays(Number(days));
    if (!daysVal.valid) return createErrorResponse(daysVal.error!, 400);

    const interestsVal = validateInterests(interests);
    if (!interestsVal.valid) return createErrorResponse(interestsVal.error!, 400);

    const budgetVal = validateBudget(budget);
    if (!budgetVal.valid) return createErrorResponse(budgetVal.error!, 400);

    const travelStyleVal = validateTravelStyle(travelStyle);
    if (!travelStyleVal.valid) return createErrorResponse(travelStyleVal.error!, 400);

    const cleanDestination = sanitizeInput(destination);

    // Cache lookup
    const cacheKey = createCacheKey('itinerary', {
      destination: cleanDestination,
      days,
      interests,
      budget,
      travelStyle,
    });

    const cachedData = getFromCache<ItineraryResponse>(cacheKey);
    if (cachedData) {
      return Response.json(cachedData);
    }

    // Call Gemini
    const prompts = buildItineraryPrompt(cleanDestination, Number(days), interests, budget, travelStyle);
    const result = await generateContent(prompts.user, prompts.system, true);

    // Cache results
    setInCache(cacheKey, result);

    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return createErrorResponse(`Itinerary Generator API Error: ${msg}`, 500);
  }
}
