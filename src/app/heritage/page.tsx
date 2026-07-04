'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { SAMPLE_DESTINATIONS } from '@/lib/constants';
import type { HeritageSite } from '@/types';
import { Landmark, Compass, Clock, Camera, ExternalLink, AlertTriangle, MapPin as MapPinIcon, Sparkles } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

export default function HeritagePage() {
  const [destination, setDestination] = useState('');
  const [siteName, setSiteName] = useState('');
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsLoading(true);
    setError(null);
    setSites([]);

    try {
      const res = await fetch('/api/heritage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          siteName,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to fetch heritage sites');
      }

      const data = await res.json();
      setSites(data.sites || []);
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
          <span className="gradient-text">Heritage & Landmarks</span> Guide
        </h1>
        <p className="page-subtitle">
          Deep dive into the architecture, history, and secrets of UNESCO heritage and local monuments.
        </p>
      </header>

      {/* Input controls */}
      <Card className="glass" padding="lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <form onSubmit={handleSearch} className="form-grid">
          <div className="form-group">
            <Input
              label="Destination/City"
              placeholder="e.g. Rome, Beijing, Cairo, Giza"
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
            <Input
              label="Specific Landmark (Optional)"
              placeholder="e.g. Colosseum, Great Wall, Pyramids"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>

          <div className="form-group full-width" style={{ marginTop: 'var(--space-md)' }}>
            <Button type="submit" isLoading={isLoading} fullWidth>
              <Landmark size={18} /> Retrieve Heritage Guides
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

      {/* Skeletons */}
      {isLoading && (
        <div className="results-grid cols-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Card key={idx} padding="lg">
              <Skeleton variant="text" width="60%" height={24} style={{ marginBottom: 12 }} />
              <Skeleton variant="text" width="40%" height={16} style={{ marginBottom: 20 }} />
              <Skeleton variant="rect" height={120} style={{ marginBottom: 20 }} />
              <Skeleton variant="text" width="90%" height={16} />
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && sites.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-state-icon"><Landmark size={48} /></div>
          <h2 className="empty-state-title">Awaiting Landmark Details</h2>
          <p className="empty-state-text">
            Enter a destination or specific historic monument above to fetch deep architecture timelines and local legends.
          </p>
        </div>
      )}

      {/* Heritage sites output */}
      {!isLoading && sites.length > 0 && (
        <div className="results-grid">
          {sites.map((site, idx) => (
            <Card key={idx} hoverable padding="lg" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                    <DynamicIcon name={site.icon} size={22} className="inline-icon" /> {site.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPinIcon size={12} /> {site.location}
                  </span>
                </div>
                <Badge variant="outline"><Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Origin: {site.yearEstablished}</Badge>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)' }}>
                  Architecture & Style
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  <Landmark size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> {site.architecturalStyle}
                </p>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 2 }}>
                  Historical Narrative
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {site.historicalSignificance}
                </p>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.75rem', display: 'block', marginBottom: 2 }}>
                  Cultural Impact Today
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {site.culturalImpact}
                </p>
              </div>

              {/* Fascinating fact callout */}
              <div style={{ background: 'var(--gradient-subtle)', border: '1px dashed var(--accent-primary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <span className="form-label" style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', display: 'block', marginBottom: 2 }}>
                  <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Did You Know?
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {site.didYouKnow}
                </p>
              </div>

              {/* Tips for visitors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-md)', marginTop: 'auto' }}>
                <div>
                  <span className="form-label" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-primary)', marginBottom: 2 }}>
                    <Clock size={12} /> Best Visit
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{site.bestTimeToVisit}</p>
                </div>
                <div>
                  <span className="form-label" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-primary)', marginBottom: 2 }}>
                    <Camera size={12} /> Camera Tips
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{site.photographyTips}</p>
                </div>
              </div>

              {/* Nearby list */}
              {site.nearbyAttractions?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-sm)' }}>
                  <span className="form-label" style={{ fontSize: '0.7rem', display: 'block', marginBottom: 4 }}>
                    <MapPinIcon size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Nearby Cultural Spots
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {site.nearbyAttractions.map((attr, i) => (
                      <Badge key={i} variant="secondary">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
