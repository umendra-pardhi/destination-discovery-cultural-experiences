'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StreamingText } from '@/components/ui/StreamingText';
import { useStreamingResponse } from '@/hooks/useStreamingResponse';
import { STORY_STYLES, SAMPLE_DESTINATIONS } from '@/lib/constants';
import type { StoryStyle } from '@/types';
import { BookOpen, HelpCircle } from 'lucide-react';

export default function StoriesPage() {
  const [destination, setDestination] = useState('');
  const [style, setStyle] = useState<StoryStyle>('modern');
  const [focusArea, setFocusArea] = useState('');

  const { text, isStreaming, error, startStream, stopStream, reset } = useStreamingResponse();

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    startStream('/api/stories', {
      destination,
      style,
      focusArea,
    });
  };

  const selectSample = (val: string) => {
    setDestination(val);
  };

  return (
    <div className="page container">
      <header className="page-header">
        <h1 className="page-title">
          <span className="gradient-text">Immersive Cultural</span> Stories
        </h1>
        <p className="page-subtitle">
          Stream live stories and legends generated on-the-fly. Choose a style below and watch history come alive.
        </p>
      </header>

      {/* Query Form */}
      <Card className="glass" padding="lg" style={{ marginBottom: 'var(--space-2xl)' }}>
        <form onSubmit={handleGenerateStory} className="form-grid">
          <div className="form-group full-width">
            <Input
              label="Destination to tell a story about"
              placeholder="e.g. Kyoto, Fez, Cusco, Rome"
              value={destination}
              disabled={isStreaming}
              onChange={(e) => setDestination(e.target.value)}
            />
            {/* Quick samples */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
                Try:
              </span>
              {SAMPLE_DESTINATIONS.slice(4, 8).map((sample) => (
                <button
                  key={sample}
                  type="button"
                  disabled={isStreaming}
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
              label="Storytelling Style"
              options={STORY_STYLES}
              value={style}
              disabled={isStreaming}
              onChange={(e) => setStyle(e.target.value as StoryStyle)}
            />
          </div>

          <div className="form-group">
            <Input
              label="Focus/Themes (Optional)"
              placeholder="e.g. Silk Road, local folklore, weavers"
              value={focusArea}
              disabled={isStreaming}
              onChange={(e) => setFocusArea(e.target.value)}
            />
          </div>

          <div className="form-group full-width" style={{ marginTop: 'var(--space-md)' }}>
            {isStreaming ? (
              <Button type="button" variant="danger" onClick={stopStream} fullWidth>
                Stop Story Generation
              </Button>
            ) : (
              <Button type="submit" fullWidth>
                <BookOpen size={18} /> Stream Immersive Tale
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Error state */}
      {error ? (
        <div className="error-state">
          <p className="error-state-text">⚠️ {error}</p>
        </div>
      ) : null}

      {/* Story Output Display */}
      {(text || isStreaming) && (
        <Card className="glass" padding="lg" style={{ minHeight: '300px', animation: 'fadeIn 0.3s ease' }}>
          <div className="story-content">
            <StreamingText text={text} isStreaming={isStreaming} />
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!text && !isStreaming && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <h2 className="empty-state-title">Awaiting Story Theme</h2>
          <p className="empty-state-text">
            Provide a destination and narrative style to begin streaming rich historical epics and folktales.
          </p>
        </div>
      )}
    </div>
  );
}
