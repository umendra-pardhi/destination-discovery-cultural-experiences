import { vi, describe, it, expect } from 'vitest';
import { POST } from '../itinerary/route';
import { NextRequest } from 'next/server';

vi.mock('@/lib/gemini', () => ({
  generateContent: vi.fn().mockResolvedValue({
    destination: 'Kyoto',
    totalDays: 2,
    overview: 'Short cultural tour',
    days: [
      {
        day: 1,
        theme: 'Historical Temples',
        activities: [
          {
            time: '9:00 AM - 11:00 AM',
            activity: 'Kinkakuji Temple Visit',
            description: 'Tour the iconic golden pavilion.',
            tip: 'Go early to avoid tour buses.',
            icon: 'Landmark'
          }
        ],
        mealSuggestion: 'Handmade Soba noodles at local diner',
        culturalNote: 'Soba represents longevity.'
      }
    ],
    packingTips: ['Comfortable walking shoes'],
    budgetEstimate: '$50 per day'
  }),
  createErrorResponse: (message: string, status: number) => 
    Response.json({ error: 'Request failed', message, status }, { status })
}));

vi.mock('@/lib/rateLimit', () => ({
  isRateLimited: vi.fn().mockReturnValue(false)
}));

describe('Itinerary API Route Handler', () => {
  it('should generate an itinerary successfully for valid inputs', async () => {
    const req = new NextRequest('http://localhost/api/itinerary', {
      method: 'POST',
      body: JSON.stringify({
        destination: 'Kyoto, Japan',
        days: 2,
        interests: ['history', 'food'],
        budget: 'moderate',
        travelStyle: 'solo'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.destination).toBe('Kyoto');
    expect(data.totalDays).toBe(2);
    expect(data.days[0].theme).toBe('Historical Temples');
  });

  it('should return 400 for out of bounds duration days', async () => {
    const req = new NextRequest('http://localhost/api/itinerary', {
      method: 'POST',
      body: JSON.stringify({
        destination: 'Kyoto, Japan',
        days: 45, // Max is 30
        interests: ['history'],
        budget: 'moderate'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.message).toContain('Days must be between 1 and 30');
  });
});
