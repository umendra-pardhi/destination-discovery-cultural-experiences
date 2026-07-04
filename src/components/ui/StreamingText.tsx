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

    for (let line of lines) {
      let trimmed = line.trim();
      if (!trimmed) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        continue;
      }

      // Convert bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Convert headings
      if (trimmed.startsWith('### ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h3>${trimmed.slice(4)}</h3>`);
      } else if (trimmed.startsWith('## ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h2>${trimmed.slice(3)}</h2>`);
      } else if (trimmed.startsWith('# ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h1>${trimmed.slice(2)}</h1>`);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Bullet list item
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        processedLines.push(`<li>${line.replace(/^\s*[-*]\s+/, '')}</li>`);
      } else {
        // Normal paragraph
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<p>${line}</p>`);
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
