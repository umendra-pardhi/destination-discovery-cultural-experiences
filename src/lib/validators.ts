/* ============================================================
   Wanderlore — Input Validation & Sanitization
   ============================================================ */

const DANGEROUS_PATTERNS = [
  /ignore\s+(?:previous|above|all\s+previous|all)\s+(?:instructions|prompts)/i,
  /system\s*prompt/i,
  /you\s+are\s+now/i,
  /act\s+as\s+if/i,
  /pretend\s+to\s+be/i,
  /jailbreak/i,
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
];

/** Sanitize free-form user text to remove injection attempts and XSS. */
export function sanitizeInput(input: string): string {
  let cleaned = input.trim();
  // Strip HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ');
  return cleaned;
}

/** Check if input contains prompt injection attempts. */
export function containsInjection(input: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}

/** Validate a destination string. */
export function validateDestination(destination: string): { valid: boolean; error?: string } {
  if (!destination || destination.trim().length === 0) {
    return { valid: false, error: 'Destination is required.' };
  }
  if (destination.length > 200) {
    return { valid: false, error: 'Destination name is too long (max 200 characters).' };
  }
  if (containsInjection(destination)) {
    return { valid: false, error: 'Invalid input detected.' };
  }
  return { valid: true };
}

/** Validate interests array. */
export function validateInterests(interests: string[]): { valid: boolean; error?: string } {
  const allowed = [
    'history', 'food', 'adventure', 'art', 'spirituality', 'nature',
    'architecture', 'music', 'festivals', 'nightlife', 'photography', 'wellness',
  ];
  if (!Array.isArray(interests) || interests.length === 0) {
    return { valid: false, error: 'At least one interest is required.' };
  }
  if (interests.length > 6) {
    return { valid: false, error: 'Too many interests selected (max 6).' };
  }
  const invalid = interests.filter((i) => !allowed.includes(i));
  if (invalid.length > 0) {
    return { valid: false, error: `Invalid interests: ${invalid.join(', ')}` };
  }
  return { valid: true };
}

/** Validate budget level. */
export function validateBudget(budget: string): { valid: boolean; error?: string } {
  const allowed = ['budget', 'moderate', 'luxury'];
  if (!allowed.includes(budget)) {
    return { valid: false, error: 'Invalid budget level.' };
  }
  return { valid: true };
}

/** Validate travel style. */
export function validateTravelStyle(style: string): { valid: boolean; error?: string } {
  const allowed = ['solo', 'couple', 'family', 'group', 'backpacker'];
  if (!allowed.includes(style)) {
    return { valid: false, error: 'Invalid travel style.' };
  }
  return { valid: true };
}

/** Validate number of days (1-30). */
export function validateDays(days: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(days) || days < 1 || days > 30) {
    return { valid: false, error: 'Days must be between 1 and 30.' };
  }
  return { valid: true };
}

/** Validate chat message. */
export function validateChatMessage(message: string): { valid: boolean; error?: string } {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty.' };
  }
  if (message.length > 2000) {
    return { valid: false, error: 'Message is too long (max 2000 characters).' };
  }
  if (containsInjection(message)) {
    return { valid: false, error: 'Invalid input detected.' };
  }
  return { valid: true };
}

/** Validate story style. */
export function validateStoryStyle(style: string): { valid: boolean; error?: string } {
  const allowed = ['historical', 'legend', 'modern'];
  if (!allowed.includes(style)) {
    return { valid: false, error: 'Invalid story style.' };
  }
  return { valid: true };
}
