'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { GEM_CATEGORIES, SAMPLE_DESTINATIONS } from '@/lib/constants';
import type { HiddenGem, GemCategory } from '@/types';
import { Sparkles, MapPin, Search } from 'lucide-react';

export default function HiddenGemsPage() {
  const [destination, setDestination] = useState('');
  const [selectedCats, setSelectedCats] = useState<GemCategory[]>([]);
  const [gems, setGems] = useState<HiddenGem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (cat: GemCategory) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const selectSample = (val: string) => {
    setDestination(val);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError('Please input a destination.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGems([]);

    try {
      const res = await fetch('/api/hidden-gems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          categories: selectedCats,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch hidden gems');
      }

      const data = await res.json();
      setGems(data.gems || []);
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
          <span className="gradient-text">Hidden Gems</span> Finder
        </h1>
        <p className="page-subtitle">
          Unveil low-tourist secret spots, authentic family eateries, artisan workshops, and historic local backstreets.
        </p>
      </header>

      {/* Inputs */}
      <Card className="glass" padding="lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <form onSubmit={handleSearch} className="form-grid">
          <div className="form-group full-width">
            <Input
              label="Enter City or Country"
              placeholder="e.g. Oaxaca, Kyoto, Marrakech"
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

          <div className="form-group full-width">
            <span className="form-label">Filter Category (Optional)</span>
            <div className="chips-container">
              {GEM_CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleCategory(item.value as GemCategory)}
                  className={`chip ${selectedCats.includes(item.value as GemCategory) ? 'active' : ''}`}
                >
                  <span>{item.emoji}</span> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group full-width" style={{ marginTop: 'var(--space-md)' }}>
            <Button type="submit" isLoading={isLoading} fullWidth>
              <Search size={18} /> Seek Out Secrets
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

      {/* Skeletons */}
      {isLoading && (
        <div className="results-grid cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} padding="lg">
              <Skeleton variant="text" width="60%" height={22} style={{ marginBottom: 12 }} />
              <Skeleton variant="text" width="40%" height={14} style={{ marginBottom: 20 }} />
              <Skeleton variant="rect" height={100} style={{ marginBottom: 15 }} />
              <Skeleton variant="text" width="100%" height={14} />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && gems.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">💎</div>
          <h2 className="empty-state-title">Awaiting Destination Input</h2>
          <p className="empty-state-text">
            Enter a destination above to retrieve authentic, local-focused hidden gems that help support sustainable community travel.
          </p>
        </div>
      )}

      {/* Output Grid */}
      {!isLoading && gems.length > 0 && (
        <div className="results-grid cols-3">
          {gems.map((gem, idx) => (
            <Card key={idx} hoverable padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {gem.emoji} {gem.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {gem.location}
                  </span>
                </div>
                <Badge variant="primary">{gem.category.toUpperCase()}</Badge>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {gem.description}
              </p>

              <div style={{ background: 'var(--bg-tertiary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <span className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 4 }}>
                  💖 Local Insight
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {gem.whySpecial}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-md)', marginTop: 'auto' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontStyle: 'italic' }}>
                  💡 <strong>Insider Tip:</strong> {gem.localTip}
                </p>
                <div style={{ marginTop: 8 }}>
                  <Badge variant="outline">🕒 Best Time: {gem.bestTime}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
