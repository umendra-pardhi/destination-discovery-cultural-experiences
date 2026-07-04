import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../discover/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/gemini', () => ({
  generateContent: vi.fn().mockResolvedValue({
    destinations: [
      {
        name: 'Mock Kyoto',
        country: 'Japan',
        icon: 'Compass',
        bestTime: 'Autumn',
        whySpecial: 'Temples and gardens',
        hiddenGem: 'Giouji Temple - Moss garden',
        highlights: ['Kinkakuji', 'Arashiyama'],
      }
    ]
  }),
  createErrorResponse: (message: string, status: number) => 
    Response.json({ error: 'Request failed', message, status }, { status })
}));

vi.mock('@/lib/rateLimit', () => ({
  isRateLimited: vi.fn().mockReturnValue(false)
}));

describe('Discover API Route Handler', () => {
  it('should successfully return recommendations for valid parameters', async () => {
    const req = new NextRequest('http://localhost/api/discover', {
      method: 'POST',
      body: JSON.stringify({
        interests: ['food', 'history'],
        travelStyle: 'solo',
        budget: 'moderate',
        duration: '7 days',
        region: 'Asia'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.destinations).toBeDefined();
    expect(data.destinations[0].name).toBe('Mock Kyoto');
  });

  it('should return 400 bad request for invalid interest fields', async () => {
    const req = new NextRequest('http://localhost/api/discover', {
      method: 'POST',
      body: JSON.stringify({
        interests: ['hacking'], // Disallowed interest
        travelStyle: 'solo',
        budget: 'moderate'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain('Invalid interests');
  });

  it('should return 400 bad request for invalid budget tier', async () => {
    const req = new NextRequest('http://localhost/api/discover', {
      method: 'POST',
      body: JSON.stringify({
        interests: ['food'],
        travelStyle: 'solo',
        budget: 'free' // Disallowed budget
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain('Invalid budget level');
  });
});
