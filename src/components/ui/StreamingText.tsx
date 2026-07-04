import { useEffect, useState, useRef } from 'react';

export interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
}

export function StreamingText({ text, isStreaming, className = '' }: StreamingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Process markdown to HTML safely for rendering
    // Process markdown to HTML safely for rendering line-by-line
    const lines = text.split('\n');
    let inList = false;
    const processedLines = [];

    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        continue;
      }

      // Escape HTML tags from content first
      let escapedLine = escapeHtml(trimmed);

      // Convert bold text
      escapedLine = escapedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Convert headings
      if (trimmed.startsWith('### ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h3>${escapedLine.replace(/^###\s+/, '')}</h3>`);
      } else if (trimmed.startsWith('## ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h2>${escapedLine.replace(/^##\s+/, '')}</h2>`);
      } else if (trimmed.startsWith('# ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h1>${escapedLine.replace(/^#\s+/, '')}</h1>`);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Bullet list item
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        processedLines.push(`<li>${escapedLine.replace(/^\s*[-*]\s+/, '')}</li>`);
      } else {
        // Normal paragraph
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<p>${escapedLine}</p>`);
      }
    }

    if (inList) {
      processedLines.push('</ul>');
    }

    setHtml(processedLines.filter(Boolean).join('\n'));

    // Auto-scroll chat container if streaming
    if (isStreaming && containerRef.current) {
      const scrollParent = containerRef.current.closest('[class*="chat-messages"]') || containerRef.current.closest('div');
      if (scrollParent) {
        scrollParent.scrollTop = scrollParent.scrollHeight;
      }
    }
  }, [text, isStreaming]);

  return (
    <div
      ref={containerRef}
      className={`${className} ${isStreaming ? 'streaming-cursor' : ''}`}
      dangerouslySetInnerHTML={{ __html: html || '<p>...</p>' }}
    />
  );
}
