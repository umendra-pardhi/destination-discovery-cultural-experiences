import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCacheKey, getFromCache, setInCache } from '../cache';

describe('In-Memory Caching System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('createCacheKey', () => {
    it('should generate a string based on prefix and parameters', () => {
      const key = createCacheKey('test', { query: 'tokyo', page: 1 });
      expect(key).toContain('test:');
      expect(key).toContain('query="tokyo"');
      expect(key).toContain('page=1');
    });

    it('should generate identical keys regardless of parameter ordering', () => {
      const key1 = createCacheKey('test', { a: 1, b: 2 });
      const key2 = createCacheKey('test', { b: 2, a: 1 });
      expect(key1).toBe(key2);
    });
  });

  describe('getFromCache and setInCache', () => {
    it('should retrieve a stored entry before expiration', () => {
      const key = 'cache:test:1';
      const data = { result: 'value' };
      
      setInCache(key, data);
      expect(getFromCache(key)).toEqual(data);
    });

    it('should return undefined and delete the entry after expiration TTL', () => {
      const key = 'cache:test:2';
      const data = { result: 'value' };

      setInCache(key, data);
      
      // Advance clock by 6 minutes (TTL is 5 minutes = 300,000ms)
      vi.advanceTimersByTime(360000);

      expect(getFromCache(key)).toBeUndefined();
    });

    it('should cap cache size at 100 and evict the oldest key', () => {
      // Load 100 entries
      for (let i = 1; i <= 100; i++) {
        setInCache(`key:${i}`, `value:${i}`);
      }

      // Verify key:1 exists
      expect(getFromCache('key:1')).toBe('value:1');

      // Add one more entry (total 101 entries, triggering eviction of key:1 as the oldest key)
      setInCache('key:101', 'value:101');

      // Oldest key should be evicted
      expect(getFromCache('key:1')).toBeUndefined();
      
      // Newer keys should still exist
      expect(getFromCache('key:100')).toBe('value:100');
      expect(getFromCache('key:101')).toBe('value:101');
    });
  });
});
