/* ============================================================
   Wanderlore — IP-Based Rate Limiting Utility
   ============================================================ */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitRecord>();

/**
 * Checks if a request client IP exceeds rate limits.
 * Default: Max 20 requests per 1 minute window.
 */
export function isRateLimited(ip: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const record = tracker.get(ip);

  // Periodically clean up old entries to prevent memory leaks
  if (tracker.size > 1000) {
    for (const [key, val] of tracker.entries()) {
      if (now >= val.resetTime) {
        tracker.delete(key);
      }
    }
  }

  if (!record || now >= record.resetTime) {
    tracker.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  record.count += 1;
  if (record.count > limit) {
    return true;
  }
  return false;
}
