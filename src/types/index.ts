/* ============================================================
   Wanderlore — TypeScript Type Definitions
   ============================================================ */

// ── Traveler Preferences ──────────────────────────────────────

export type TravelStyle = 'solo' | 'couple' | 'family' | 'group' | 'backpacker';
export type BudgetLevel = 'budget' | 'moderate' | 'luxury';
export type Interest =
  | 'history'
  | 'food'
  | 'adventure'
  | 'art'
  | 'spirituality'
  | 'nature'
  | 'architecture'
  | 'music'
  | 'festivals'
  | 'nightlife'
  | 'photography'
  | 'wellness';

export interface TravelerProfile {
  interests: Interest[];
  travelStyle: TravelStyle;
  budget: BudgetLevel;
  duration: string;
  region?: string;
}

// ── Destination Discovery ─────────────────────────────────────

export interface Destination {
  name: string;
  country: string;
  tagline: string;
  culturalNarrative: string;
  highlights: string[];
  bestTime: string;
  budgetLevel: BudgetLevel;
  hiddenGem: string;
  icon: string;
}

export interface DiscoverResponse {
  destinations: Destination[];
}

// ── Hidden Gems ───────────────────────────────────────────────

export type GemCategory =
  | 'food'
  | 'viewpoint'
  | 'artisan'
  | 'sacred'
  | 'street-art'
  | 'market'
  | 'nature'
  | 'nightlife';

export interface HiddenGem {
  name: string;
  location: string;
  category: GemCategory;
  description: string;
  whySpecial: string;
  localTip: string;
  bestTime: string;
  icon: string;
}

export interface HiddenGemsResponse {
  destination: string;
  gems: HiddenGem[];
}

// ── Cultural Storytelling ─────────────────────────────────────

export type StoryStyle = 'historical' | 'legend' | 'modern';

export interface StoryRequest {
  destination: string;
  style: StoryStyle;
  focusArea?: string;
}

// ── Festivals & Events ────────────────────────────────────────

export interface Festival {
  name: string;
  destination: string;
  date: string;
  duration: string;
  significance: string;
  whatToExpect: string;
  dressCode: string;
  etiquette: string;
  localTip: string;
  icon: string;
}

export interface FestivalResponse {
  festivals: Festival[];
}

// ── Heritage Guide ────────────────────────────────────────────

export interface HeritageSite {
  name: string;
  location: string;
  yearEstablished: string;
  architecturalStyle: string;
  historicalSignificance: string;
  culturalImpact: string;
  didYouKnow: string;
  bestTimeToVisit: string;
  photographyTips: string;
  nearbyAttractions: string[];
  icon: string;
}

export interface HeritageResponse {
  sites: HeritageSite[];
}

// ── AI Companion Chat ─────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ── Itinerary Generator ───────────────────────────────────────

export interface ItineraryRequest {
  destination: string;
  days: number;
  interests: Interest[];
  budget: BudgetLevel;
  travelStyle: TravelStyle;
}

export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
  tip: string;
  icon: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: ItineraryActivity[];
  mealSuggestion: string;
  culturalNote: string;
}

export interface ItineraryResponse {
  destination: string;
  totalDays: number;
  overview: string;
  days: ItineraryDay[];
  packingTips: string[];
  budgetEstimate: string;
}

// ── API Responses ─────────────────────────────────────────────

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// ── Theme ─────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';
