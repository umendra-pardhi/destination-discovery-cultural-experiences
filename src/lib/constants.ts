/* ============================================================
   Wanderlore — Application Constants
   ============================================================ */

export const APP_NAME = 'Wanderlore';
export const APP_TAGLINE = 'Discover the Stories Behind Every Destination';
export const APP_DESCRIPTION =
  'AI-powered cultural travel companion that transforms trip planning into immersive storytelling. Discover hidden gems, experience local festivals, and explore heritage — all through the lens of authentic cultural narratives.';

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const API_TIMEOUT_MS = 30_000;
export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const INTERESTS = [
  { value: 'history', label: 'History', iconName: 'History' },
  { value: 'food', label: 'Food & Cuisine', iconName: 'ChefHat' },
  { value: 'adventure', label: 'Adventure', iconName: 'Mountain' },
  { value: 'art', label: 'Art & Culture', iconName: 'Palette' },
  { value: 'spirituality', label: 'Spirituality', iconName: 'Flame' },
  { value: 'nature', label: 'Nature', iconName: 'Trees' },
  { value: 'architecture', label: 'Architecture', iconName: 'Building' },
  { value: 'music', label: 'Music & Dance', iconName: 'Music' },
  { value: 'festivals', label: 'Festivals', iconName: 'PartyPopper' },
  { value: 'nightlife', label: 'Nightlife', iconName: 'Moon' },
  { value: 'photography', label: 'Photography', iconName: 'Camera' },
  { value: 'wellness', label: 'Wellness', iconName: 'Heart' },
] as const;

export const TRAVEL_STYLES = [
  { value: 'solo', label: 'Solo Explorer', iconName: 'User' },
  { value: 'couple', label: 'Couple', iconName: 'Heart' },
  { value: 'family', label: 'Family', iconName: 'Users' },
  { value: 'group', label: 'Friend Group', iconName: 'Users' },
  { value: 'backpacker', label: 'Backpacker', iconName: 'Footprints' },
] as const;

export const BUDGET_LEVELS = [
  { value: 'budget', label: 'Budget-Friendly', iconName: 'Coins' },
  { value: 'moderate', label: 'Moderate', iconName: 'CreditCard' },
  { value: 'luxury', label: 'Luxury', iconName: 'Gem' },
] as const;

export const STORY_STYLES = [
  { value: 'historical', label: 'Historical Epic', iconName: 'History', description: 'Walk through centuries of history' },
  { value: 'legend', label: 'Local Legend', iconName: 'Flame', description: 'Myths and folklore from the region' },
  { value: 'modern', label: 'Modern Journey', iconName: 'Compass', description: 'Contemporary cultural discovery' },
] as const;

export const GEM_CATEGORIES = [
  { value: 'food', label: 'Food & Drink', iconName: 'Utensils' },
  { value: 'viewpoint', label: 'Secret Viewpoints', iconName: 'Eye' },
  { value: 'artisan', label: 'Artisan Workshops', iconName: 'Hammer' },
  { value: 'sacred', label: 'Sacred Spaces', iconName: 'Landmark' },
  { value: 'street-art', label: 'Street Art', iconName: 'Palette' },
  { value: 'market', label: 'Local Markets', iconName: 'ShoppingBag' },
  { value: 'nature', label: 'Nature Spots', iconName: 'Trees' },
  { value: 'nightlife', label: 'Nightlife', iconName: 'Moon' },
] as const;

export const NAV_LINKS = [
  { href: '/discover', label: 'Discover', iconName: 'Compass' },
  { href: '/hidden-gems', label: 'Hidden Gems', iconName: 'Gem' },
  { href: '/stories', label: 'Stories', iconName: 'BookOpen' },
  { href: '/festivals', label: 'Festivals', iconName: 'Calendar' },
  { href: '/heritage', label: 'Heritage', iconName: 'Landmark' },
  { href: '/companion', label: 'AI Guide', iconName: 'MessageSquare' },
  { href: '/itinerary', label: 'Itinerary', iconName: 'FileText' },
] as const;

export const SAMPLE_DESTINATIONS = [
  'Kyoto, Japan',
  'Marrakech, Morocco',
  'Oaxaca, Mexico',
  'Varanasi, India',
  'Fez, Morocco',
  'Luang Prabang, Laos',
  'Cusco, Peru',
  'Istanbul, Turkey',
  'Chiang Mai, Thailand',
  'Havana, Cuba',
  'Bruges, Belgium',
  'Jaipur, India',
];
