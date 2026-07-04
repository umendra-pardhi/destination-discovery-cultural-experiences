'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StreamingText } from '@/components/ui/StreamingText';
import { useChat } from '@/hooks/useChat';
import { Send, Trash2, ShieldAlert, Bot, Compass, User } from 'lucide-react';

export default function CompanionPage() {
  const [inputText, setInputText] = useState('');
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="page container">
      <header className="page-header" style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 className="page-title">
          <span className="gradient-text">AI Cultural</span> Companion
        </h1>
        <p className="page-subtitle">
          Ask Wanderlore about local table manners, translations, dress codes, negotiation tips, or neighborhood guides.
        </p>
      </header>

      <Card className="glass chat-container" padding="none">
        {/* Chat Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-md) var(--space-lg)',
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--bg-secondary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem', display: 'inline-flex', alignItems: 'center' }}><Bot size={24} /></span>
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Wanderlore</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>● Online Advisor</span>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.8rem',
                color: 'var(--error)',
                fontWeight: 600,
              }}
              title="Clear chat history"
              aria-label="Clear chat history"
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>

        {/* Chat History Panel */}
        <div className="chat-messages" style={{ padding: 'var(--space-lg)' }}>
          {messages.length === 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              gap: 'var(--space-md)',
              opacity: 0.8,
            }}>
              <Compass size={40} style={{ opacity: 0.7 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Start Your Cultural Dialogue</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
                "How do I politely toast in Georgia?"<br />
                "What should I wear when visiting temples in Bangkok?"<br />
                "Explain the tradition of Fika in Sweden."
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`chat-message ${isUser ? 'user' : 'assistant'}`}>
                <div className="chat-avatar">
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className="chat-bubble">
                  {isUser ? (
                    <p style={{ margin: 0 }}>{msg.content}</p>
                  ) : (
                    <StreamingText text={msg.content} isStreaming={isLoading && !msg.content} />
                  )}
                </div>
              </div>
            );
          })}

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 'var(--space-md)',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)',
              fontSize: '0.9rem',
              alignSelf: 'center',
              maxWidth: '90%',
            }}>
              <ShieldAlert size={16} /> {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Panel */}
        <form onSubmit={handleSubmit} className="chat-input-container" style={{ padding: 'var(--space-lg)' }}>
          <input
            type="text"
            className="glass"
            style={{
              flex: 1,
              padding: 'var(--space-md) var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.95rem',
            }}
            placeholder="Ask Wanderlore about local etiquette, customs, or language tips..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            aria-label="Chat input message"
          />
          <Button type="submit" isLoading={isLoading} style={{ padding: '0 var(--space-xl)', height: '48px' }}>
            <Send size={16} /> <span className="visually-hidden">Send Message</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
