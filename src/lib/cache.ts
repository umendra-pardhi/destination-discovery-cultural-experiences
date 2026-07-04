/* ============================================================
   Wanderlore — Simple In-Memory Cache
   ============================================================ */

import { CACHE_TTL_MS } from './constants';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/** Create a cache key from request parameters. */
export function createCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sorted = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join('&');
  return `${prefix}:${sorted}`;
}

/** Get a cached value, or undefined if expired/missing. */
export function getFromCache<T>(key: string): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return undefined;
  }
  return entry.data as T;
}

/** Store a value in the cache. */
export function setInCache<T>(key: string, data: T): void {
  // Cap cache size to prevent memory leaks
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}
