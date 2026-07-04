'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { SAMPLE_DESTINATIONS } from '@/lib/constants';
import type { Festival } from '@/types';
import { Sparkles, Calendar, HeartHandshake, AlertCircle } from 'lucide-react';

export default function FestivalsPage() {
  const [destination, setDestination] = useState('');
  const [month, setMonth] = useState('');
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsLoading(true);
    setError(null);
    setFestivals([]);

    try {
      const res = await fetch('/api/festivals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          month,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch festivals');
      }

      const data = await res.json();
      setFestivals(data.festivals || []);
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
          <span className="gradient-text">Festival & Events</span> Finder
        </h1>
        <p className="page-subtitle">
          Discover traditional, sacred, and seasonal festivals. Learn the etiquette to participate respectfully.
        </p>
      </header>

      {/* Form Card */}
      <Card className="glass" padding="lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <form onSubmit={handleSearch} className="form-grid">
          <div className="form-group">
            <Input
              label="Destination"
              placeholder="e.g. India, Japan, Peru, Munich"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            {/* Quick samples */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
                Try:
              </span>
              {SAMPLE_DESTINATIONS.slice(8, 12).map((sample) => (
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
            <Input
              label="Specific Month/Season (Optional)"
              placeholder="e.g. October, Spring, Cherry Blossom season"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div className="form-group full-width" style={{ marginTop: 'var(--space-md)' }}>
            <Button type="submit" isLoading={isLoading} fullWidth>
              <Calendar size={18} /> Seek Out Cultural Events
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
        <div className="results-grid cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} padding="lg">
              <Skeleton variant="text" width="60%" height={22} style={{ marginBottom: 12 }} />
              <Skeleton variant="text" width="40%" height={14} style={{ marginBottom: 20 }} />
              <Skeleton variant="rect" height={100} style={{ marginBottom: 15 }} />
              <Skeleton variant="text" width="90%" height={14} />
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && festivals.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">🎭</div>
          <h2 className="empty-state-title">Awaiting Your Input</h2>
          <p className="empty-state-text">
            Enter a region or country above to look up rich local festivals, seasonal happenings, and customs.
          </p>
        </div>
      )}

      {/* Festivals Grid */}
      {!isLoading && festivals.length > 0 && (
        <div className="results-grid">
          {festivals.map((fest, idx) => (
            <Card key={idx} hoverable padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    {fest.emoji} {fest.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> {fest.date} ({fest.duration})
                  </span>
                </div>
                <Badge variant="primary">{fest.destination}</Badge>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 2 }}>
                  Significance
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{fest.significance}</p>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 2 }}>
                  What You'll Experience
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{fest.whatToExpect}</p>
              </div>

              {/* Etiquette and guidelines */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', background: 'var(--bg-tertiary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span className="form-label" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-primary)', marginBottom: 2 }}>
                    👗 Dress Code
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{fest.dressCode}</p>
                </div>
                <div>
                  <span className="form-label" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--success)', marginBottom: 2 }}>
                    🤝 Etiquette
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{fest.etiquette}</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-md)', marginTop: 'auto' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontStyle: 'italic', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  💡 <strong>Local Tip:</strong> {fest.localTip}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
