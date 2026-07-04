import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isRateLimited } from '../rateLimit';

describe('IP-Based Rate Limiting', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should allow requests within the limit', () => {
    const ip = '192.168.1.1';
    
    // We should be able to make 20 requests
    for (let i = 0; i < 20; i++) {
      expect(isRateLimited(ip, 20)).toBe(false);
    }
  });

  it('should block requests exceeding the limit', () => {
    const ip = '192.168.1.2';
    
    // Make 20 requests
    for (let i = 0; i < 20; i++) {
      isRateLimited(ip, 20);
    }

    // The 21st request should be blocked
    expect(isRateLimited(ip, 20)).toBe(true);
  });

  it('should reset limits after the window expires', () => {
    const ip = '192.168.1.3';
    
    // Make 20 requests
    for (let i = 0; i < 20; i++) {
      isRateLimited(ip, 20);
    }
    expect(isRateLimited(ip, 20)).toBe(true);

    // Advance clock by 1 minute (60,000ms)
    vi.advanceTimersByTime(60000);

    // Request should be allowed again
    expect(isRateLimited(ip, 20)).toBe(false);
  });
});
