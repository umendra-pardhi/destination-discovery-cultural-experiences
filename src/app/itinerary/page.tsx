'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { INTERESTS, TRAVEL_STYLES, BUDGET_LEVELS, SAMPLE_DESTINATIONS } from '@/lib/constants';
import type { ItineraryResponse, Interest, TravelStyle, BudgetLevel } from '@/types';
import { FileText, Compass, Sparkles, MapPin, AlertTriangle, Globe, Coins, Clock, Lightbulb, Utensils, Backpack } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export default function ItineraryPage() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [style, setStyle] = useState<TravelStyle>('solo');
  const [budget, setBudget] = useState<BudgetLevel>('moderate');
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (val: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError('Please provide a destination.');
      return;
    }
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          interests: selectedInterests,
          budget,
          travelStyle: style,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to generate itinerary');
      }

      const data = await res.json();
      setItinerary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const selectSample = (val: string) => {
    setDestination(val);
  };

  return (
    <div className="page container">
      <header className="page-header">
        <h1 className="page-title">
          <span className="gradient-text">Cultural Itinerary</span> Generator
        </h1>
        <p className="page-subtitle">
          Construct structured, daily travel schedules balanced between legendary heritage sites and secret local hotspots.
        </p>
      </header>

      {/* Control Card */}
      <Card className="glass" padding="lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <form onSubmit={handleGenerate} className="form-grid">
          <div className="form-group">
            <Input
              label="Destination"
              placeholder="e.g. Kyoto, Oaxaca, Rome, Varanasi"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            {/* Quick samples */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
                Try:
              </span>
              {SAMPLE_DESTINATIONS.slice(0, 4).map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => selectSample(sample)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <Select
              label="Duration (Days)"
              options={Array.from({ length: 14 }).map((_, idx) => ({
                value: String(idx + 1),
                label: `${idx + 1} Day${idx === 0 ? '' : 's'}`,
              }))}
              value={String(days)}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>

          {/* Passion Chips */}
          <div className="form-group full-width">
            <span className="form-label">Select Core Cultural Passions</span>
            <div className="chips-container">
              {INTERESTS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleInterest(item.value as Interest)}
                  className={`chip ${selectedInterests.includes(item.value as Interest) ? 'active' : ''}`}
                >
                  <DynamicIcon name={item.iconName} size={16} /> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <Select
              label="Travel Style"
              options={TRAVEL_STYLES}
              value={style}
              onChange={(e) => setStyle(e.target.value as TravelStyle)}
            />
          </div>

          <div className="form-group">
            <Select
              label="Budget Level"
              options={BUDGET_LEVELS}
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetLevel)}
            />
          </div>

          <div className="form-group full-width" style={{ marginTop: 'var(--space-md)' }}>
            <Button type="submit" isLoading={isLoading} fullWidth>
              <FileText size={18} /> Generate Daily Schedule
            </Button>
          </div>
        </form>
      </Card>

      {/* Error state */}
      {error ? (
        <div className="error-state">
          <p className="error-state-text"><AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {error}</p>
        </div>
      ) : null}

      {/* Loading Skeletons */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="rect" height={80} />
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} padding="lg">
              <Skeleton variant="text" width="20%" height={22} style={{ marginBottom: 12 }} />
              <Skeleton variant="text" width="60%" height={16} style={{ marginBottom: 20 }} />
              <Skeleton variant="rect" height={100} />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !itinerary && !error && (
        <div className="empty-state">
          <div className="empty-state-icon"><FileText size={48} /></div>
          <h2 className="empty-state-title">Awaiting Custom Specs</h2>
          <p className="empty-state-text">
            Enter a destination, select duration and details to construct an optimized day-by-day itinerary complete with local insight guidelines.
          </p>
        </div>
      )}

      {/* Output Timeline */}
      {!isLoading && itinerary && (
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {/* Overview Callout */}
          <Card className="glass" padding="lg" style={{ marginBottom: 'var(--space-2xl)', borderLeft: '4px solid var(--accent-primary)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
              <Globe size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Journey through {itinerary.destination}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              {itinerary.overview}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              <Badge variant="primary"><Coins size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Est. Daily Budget: {itinerary.budgetEstimate}</Badge>
              <Badge variant="outline"><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Duration: {itinerary.totalDays} Days</Badge>
            </div>
          </Card>

          {/* Timeline Days */}
          <div className="itinerary-timeline">
            {itinerary.days.map((day) => (
              <div key={day.day} className="itinerary-day">
                <div className="itinerary-day-marker" />
                <div className="itinerary-day-header">
                  <span className="itinerary-day-number">Day {day.day}</span>
                  <h3 className="itinerary-day-theme">{day.theme}</h3>
                </div>

                {/* Day Activities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {day.activities.map((act, i) => (
                    <div key={i} className="itinerary-activity">
                      <div className="itinerary-activity-time">{act.time}</div>
                      <h4 className="itinerary-activity-name">
                        <DynamicIcon name={act.icon} size={18} className="inline-icon" /> {act.activity}
                      </h4>
                      <p className="itinerary-activity-desc">{act.description}</p>
                      <p className="itinerary-activity-tip">
                        <Lightbulb size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {act.tip}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Meal Pick */}
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: 'var(--space-md)',
                  borderRadius: 'var(--radius-md)',
                  marginTop: 'var(--space-md)',
                  border: '1px solid var(--border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <span style={{ fontSize: '1.5rem', display: 'inline-flex', alignItems: 'center' }}><Utensils size={24} /></span>
                  <div>
                    <strong style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-primary)', display: 'block' }}>
                      Recommended Culinary Experience
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{day.mealSuggestion}</span>
                  </div>
                </div>

                {/* Local Lore/Etiquette note */}
                <div className="itinerary-note">
                  <strong>Cultural Insight:</strong> {day.culturalNote}
                </div>
              </div>
            ))}
          </div>

          {/* Packing Guidelines Card */}
          {itinerary.packingTips?.length > 0 && (
            <Card className="glass" padding="lg" style={{ marginTop: 'var(--space-2xl)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
                <Backpack size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} /> Recommended packing & readiness
              </h3>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                {itinerary.packingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
