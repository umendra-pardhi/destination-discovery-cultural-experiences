'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { INTERESTS, TRAVEL_STYLES, BUDGET_LEVELS } from '@/lib/constants';
import type { Destination, Interest, TravelStyle, BudgetLevel } from '@/types';
import { Compass, Sparkles, MapPin } from 'lucide-react';

export default function DiscoverPage() {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [style, setStyle] = useState<TravelStyle>('solo');
  const [budget, setBudget] = useState<BudgetLevel>('moderate');
  const [duration, setDuration] = useState('7 days');
  const [region, setRegion] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (val: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest area.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDestinations([]);

    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interests: selectedInterests,
          travelStyle: style,
          budget,
          duration,
          region,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch recommendations');
      }

      const data = await res.json();
      setDestinations(data.destinations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page container">
      <header className="page-header">
        <h1 className="page-title">
          <span className="gradient-text">Destination Discovery</span> Engine
        </h1>
        <p className="page-subtitle">
          Find your next custom adventure based on deep cultural interest profiles rather than standard tourist packages.
        </p>
      </header>

      {/* Profile Form */}
      <Card className="glass" padding="lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <form onSubmit={handleDiscover} className="form-grid">
          {/* Interests Selection */}
          <div className="form-group full-width">
            <span className="form-label">What details are you passionate about?</span>
            <div className="chips-container">
              {INTERESTS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleInterest(item.value as Interest)}
                  className={`chip ${selectedInterests.includes(item.value as Interest) ? 'active' : ''}`}
                >
                  <span>{item.emoji}</span> {item.label}
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

          <div className="form-group">
            <Input
              label="Trip Duration"
              placeholder="e.g. 10 days"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="form-group">
            <Input
              label="Preferred Continent/Region (Optional)"
              placeholder="e.g. East Asia, Central America"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>

          <div className="form-group full-width" style={{ marginTop: 'var(--space-md)' }}>
            <Button type="submit" isLoading={isLoading} fullWidth>
              <Compass size={18} /> Reveal Cultural Journeys
            </Button>
          </div>
        </form>
      </Card>

      {/* Error state */}
      {error ? (
        <div className="error-state">
          <p className="error-state-text">⚠️ {error}</p>
        </div>
      ) : null}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="results-grid cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} padding="lg">
              <Skeleton variant="text" width="60%" height={24} style={{ marginBottom: 12 }} />
              <Skeleton variant="text" width="40%" height={16} style={{ marginBottom: 20 }} />
              <Skeleton variant="rect" height={100} style={{ marginBottom: 20 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <Skeleton variant="text" width={60} height={20} />
                <Skeleton variant="text" width={80} height={20} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && destinations.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">🔮</div>
          <h2 className="empty-state-title">Awaiting Your Travel Profile</h2>
          <p className="empty-state-text">
            Choose your cultural passions and let Wanderlore custom engineer destinations loaded with history, lore, and local life.
          </p>
        </div>
      )}

      {/* Recommendations Output */}
      {!isLoading && destinations.length > 0 && (
        <div className="results-grid">
          {destinations.map((dest, idx) => (
            <Card key={idx} hoverable padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    {dest.emoji} {dest.name}
                  </h3>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={14} /> {dest.country}
                  </span>
                </div>
                <Badge variant="primary">{dest.budgetLevel.toUpperCase()}</Badge>
              </div>

              <p style={{ fontStyle: 'italic', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                "{dest.tagline}"
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {dest.culturalNarrative}
              </p>

              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-md)' }}>
                <span className="form-label" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>
                  🔑 Local Secret (Hidden Gem)
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>{dest.hiddenGem.split(' - ')[0]}:</strong> {dest.hiddenGem.split(' - ')[1] || dest.hiddenGem}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 'var(--space-md)' }}>
                {dest.highlights.map((hl, i) => (
                  <Badge key={i} variant="secondary">
                    ⚡ {hl}
                  </Badge>
                ))}
                <Badge variant="outline">📅 Best: {dest.bestTime}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
