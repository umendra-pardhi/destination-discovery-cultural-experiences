/* ============================================================
   Wanderlore — Prompt Templates
   All prompts for Gemini API calls, optimized for quality
   and token efficiency with structured JSON output.
   ============================================================ */

// ── System Prompt (shared context) ────────────────────────────

const BASE_SYSTEM = `You are Wanderlore, an AI cultural travel advisor with deep, authentic knowledge of global destinations, local customs, hidden treasures, and living cultural traditions.

CORE PRINCIPLES:
- Always prioritize culturally rich, authentic experiences over tourist traps
- Be specific — name actual places, streets, artisans, dishes, festivals
- Evoke emotion and curiosity in every response
- Be culturally sensitive and respectful of all traditions
- Include practical, actionable advice alongside cultural narrative
- Never give generic advice like "visit the main square" or "try local food"
- Each response should make the traveler FEEL the destination`;

// ── Destination Discovery ─────────────────────────────────────

export function buildDiscoverPrompt(
  interests: string[],
  travelStyle: string,
  budget: string,
  duration: string,
  region?: string
): { system: string; user: string } {
  return {
    system: BASE_SYSTEM,
    user: `Generate 4 unique destination recommendations for this traveler profile.

TRAVELER PROFILE:
- Interests: ${interests.join(', ')}
- Travel Style: ${travelStyle}
- Budget: ${budget}
- Duration: ${duration}
${region ? `- Preferred Region: ${region}` : '- Region: Open to any region worldwide'}

REQUIREMENTS:
- Include at least one lesser-known destination most travelers haven't heard of
- Each destination must have a unique cultural angle
- Narratives should be evocative and immersive (80-120 words)
- Taglines must be catchy and under 10 words
- Hidden gems must be hyper-specific (a named cafe, artisan, viewpoint)

Respond with valid JSON:
{
  "destinations": [
    {
      "name": "City/Region Name",
      "country": "Country",
      "tagline": "Evocative 8-word max hook",
      "culturalNarrative": "80-120 word immersive story that makes the reader feel the destination",
      "highlights": ["Cultural highlight 1", "Cultural highlight 2", "Cultural highlight 3"],
      "bestTime": "Best months to visit",
      "budgetLevel": "budget|moderate|luxury",
      "hiddenGem": "One hyper-specific local secret with a name and location",
      "icon": "A single relevant Lucide React icon name (e.g. MapPin, Compass, Palmtree, Landmark, ChefHat, Music, GlassWater, Hammer, Trees, Sparkles, Building, Footprints, Coins)"
    }
  ]
}`,
  };
}

// ── Hidden Gems ───────────────────────────────────────────────

export function buildHiddenGemsPrompt(
  destination: string,
  categories?: string[]
): { system: string; user: string } {
  return {
    system: BASE_SYSTEM,
    user: `Reveal 6 hidden gems in and around ${destination} that only locals know about.

${categories?.length ? `FOCUS CATEGORIES: ${categories.join(', ')}` : 'Cover a diverse mix of categories.'}

For each gem, provide the insider perspective — why locals love it, the best time to go, and a specific tip that only someone who lives there would know.

Respond with valid JSON:
{
  "destination": "${destination}",
  "gems": [
    {
      "name": "Specific place name",
      "location": "Specific area/neighborhood within ${destination}",
      "category": "food|viewpoint|artisan|sacred|street-art|market|nature|nightlife",
      "description": "What this place is and why it matters (2-3 sentences)",
      "whySpecial": "The cultural or emotional reason this gem stands out (1-2 sentences)",
      "localTip": "A specific insider tip only locals would know",
      "bestTime": "When to visit for the best experience",
      "icon": "A single relevant Lucide React icon name (e.g. MapPin, Compass, Palmtree, Landmark, ChefHat, Music, GlassWater, Hammer, Trees, Sparkles, Building, Footprints, Coins)"
    }
  ]
}`,
  };
}

// ── Cultural Storytelling ─────────────────────────────────────

export function buildStoryPrompt(
  destination: string,
  style: string,
  focusArea?: string
): { system: string; user: string } {
  const styleGuides: Record<string, string> = {
    historical: `Write as a historical epic — transport the reader through centuries. Use vivid sensory details: the smell of spice markets in the 14th century, the sound of builders constructing ancient monuments, the taste of dishes that haven't changed in generations. Weave real historical events, figures, and architectural details into a compelling narrative arc.`,
    legend: `Write as a local legend or folk tale — the kind of story a grandmother tells by firelight. Include mythical elements, local spirits, heroic figures, and the moral lessons embedded in the culture. Make the reader feel like they're sitting in a village square hearing this tale for the first time.`,
    modern: `Write as a modern cultural journey — follow a traveler experiencing the destination today through its cultural lens. Contrast the ancient and modern, capture the sensory experience of walking through markets, hearing street musicians, tasting street food, and encountering locals who share their stories.`,
  };

  return {
    system: `${BASE_SYSTEM}

You are now a master storyteller. Write immersive, emotionally resonant cultural narratives. Your stories should make readers feel transported to the destination. Use rich sensory details, compelling characters, and cultural authenticity.`,
    user: `Write an immersive cultural story about ${destination}.

STYLE: ${styleGuides[style] || styleGuides.modern}
${focusArea ? `FOCUS AREA: ${focusArea}` : ''}

LENGTH: 600-900 words
FORMAT: Write in flowing prose paragraphs. Use vivid imagery. Include cultural details that educate while entertaining. End with a reflection that connects the story to universal human themes.

Do NOT use JSON format. Write pure narrative text. Use markdown formatting with a title (## Story Title) at the start.`,
  };
}

// ── Festivals & Events ────────────────────────────────────────

export function buildFestivalPrompt(
  destination: string,
  month?: string
): { system: string; user: string } {
  return {
    system: BASE_SYSTEM,
    user: `Suggest 5 significant cultural festivals or events ${month ? `happening around ${month}` : 'throughout the year'} in or near ${destination}.

Include a mix of:
- Major cultural celebrations
- Smaller local festivals that tourists rarely attend
- Seasonal events tied to local traditions
- Religious or spiritual observances (with sensitivity)
- Food or arts festivals

Respond with valid JSON:
{
  "festivals": [
    {
      "name": "Festival name",
      "destination": "Specific location",
      "date": "When it occurs (month/season)",
      "duration": "How long it lasts",
      "significance": "What this festival means to the local culture (2-3 sentences)",
      "whatToExpect": "Vivid description of what a visitor will experience (2-3 sentences)",
      "dressCode": "What to wear or how to present yourself",
      "etiquette": "Important cultural dos and don'ts for visitors",
      "localTip": "An insider tip for getting the most authentic experience",
      "icon": "A single relevant Lucide React icon name (e.g. MapPin, Compass, Palmtree, Landmark, ChefHat, Music, GlassWater, Hammer, Trees, Sparkles, Building, Footprints, Coins)"
    }
  ]
}`,
  };
}

// ── Heritage Guide ────────────────────────────────────────────

export function buildHeritagePrompt(
  destination: string,
  siteName?: string
): { system: string; user: string } {
  return {
    system: BASE_SYSTEM,
    user: `${siteName ? `Provide a deep cultural and historical guide to ${siteName} in ${destination}.` : `Identify and provide a deep guide to 3 significant heritage sites in or near ${destination}.`}

For each site, go beyond surface-level tourist information. Reveal the layers of history, the architectural genius, the cultural significance that makes this place irreplaceable.

Respond with valid JSON:
{
  "sites": [
    {
      "name": "Heritage site name",
      "location": "Precise location",
      "yearEstablished": "Year or era of origin",
      "architecturalStyle": "Architectural style and notable features",
      "historicalSignificance": "Why this place matters in history (3-4 sentences)",
      "culturalImpact": "How this site shapes local identity and culture today (2-3 sentences)",
      "didYouKnow": "A fascinating, little-known fact",
      "bestTimeToVisit": "When to visit and why",
      "photographyTips": "Best angles, lighting times, and less-photographed details",
      "nearbyAttractions": ["Nearby cultural attraction 1", "Nearby cultural attraction 2"],
      "icon": "A single relevant Lucide React icon name (e.g. MapPin, Compass, Palmtree, Landmark, ChefHat, Music, GlassWater, Hammer, Trees, Sparkles, Building, Footprints, Coins)"
    }
  ]
}`,
  };
}

// ── AI Travel Companion ───────────────────────────────────────

export function buildCompanionSystemPrompt(): string {
  return `${BASE_SYSTEM}

You are an interactive AI travel companion named Wanderlore. You help travelers with:
- Local customs and etiquette
- Useful phrases in local languages
- Food recommendations and dietary guidance
- Safety tips and cultural sensitivities
- Real-time travel advice and problem-solving
- Historical context for sites they're visiting
- Budget tips and negotiation advice

CONVERSATION STYLE:
- Be warm, knowledgeable, and enthusiastic
- Use occasional emojis naturally (not excessively)
- Share personal-feeling anecdotes about places
- If asked about something dangerous or illegal, politely redirect
- Keep responses concise but rich (100-200 words unless user asks for more detail)
- Format with markdown when helpful (bold key terms, use bullet lists for tips)`;
}

export function buildCompanionPrompt(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
): string {
  const historyText = conversationHistory
    .slice(-10) // Keep last 10 messages for context
    .map((m) => `${m.role === 'user' ? 'Traveler' : 'Wanderlore'}: ${m.content}`)
    .join('\n\n');

  return `CONVERSATION HISTORY:
${historyText || '(New conversation)'}

CURRENT MESSAGE FROM TRAVELER:
${message}

Respond naturally as Wanderlore. Be helpful, culturally informed, and engaging.`;
}

// ── Itinerary Generator ───────────────────────────────────────

export function buildItineraryPrompt(
  destination: string,
  days: number,
  interests: string[],
  budget: string,
  travelStyle: string
): { system: string; user: string } {
  return {
    system: BASE_SYSTEM,
    user: `Create a detailed ${days}-day cultural immersion itinerary for ${destination}.

TRAVELER PROFILE:
- Interests: ${interests.join(', ')}
- Budget: ${budget}
- Travel Style: ${travelStyle}

GUIDELINES:
- Balance popular cultural sites with hidden gems
- Include specific restaurant/cafe names for meals
- Add cultural context and tips for each activity
- Consider logical geographic flow (don't zigzag across the city)
- Include rest time and serendipity slots
- Each day should have a cultural theme

Respond with valid JSON:
{
  "destination": "${destination}",
  "totalDays": ${days},
  "overview": "2-3 sentence overview of the itinerary's cultural journey",
  "days": [
    {
      "day": 1,
      "theme": "Day theme (e.g., 'Ancient Roots & Temple Mornings')",
      "activities": [
        {
          "time": "Time range (e.g., '8:00 AM - 10:00 AM')",
          "activity": "Activity name",
          "description": "What you'll do and see (2-3 sentences)",
          "tip": "Practical or cultural tip",
          "icon": "A single relevant Lucide React icon name (e.g. MapPin, Compass, Palmtree, Landmark, ChefHat, Music, GlassWater, Hammer, Trees, Sparkles, Building, Footprints, Coins)"
        }
      ],
      "mealSuggestion": "Specific restaurant or food recommendation with a named dish",
      "culturalNote": "Cultural insight related to the day's theme"
    }
  ],
  "packingTips": ["Packing tip 1", "Packing tip 2", "Packing tip 3"],
  "budgetEstimate": "Rough daily budget estimate in USD"
}`,
  };
}
