/* ============================================================
   Wanderlore — useStreamingResponse Hook
   ============================================================ */
'use client';

import { useState, useCallback, useRef } from 'react';

interface UseStreamingResponseOptions {
  onComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

export function useStreamingResponse(options?: UseStreamingResponseOptions) {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      // Cancel previous stream if active
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setText('');
      setError(null);
      setIsStreaming(true);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({ message: 'Request failed' }));
          throw new Error(errData.message || `Error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response stream available');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setText(accumulated);
        }

        setIsStreaming(false);
        options?.onComplete?.(accumulated);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Silently ignore aborts
        }
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
        setIsStreaming(false);
        options?.onError?.(message);
      }
    },
    [options]
  );

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    stopStream();
    setText('');
    setError(null);
  }, [stopStream]);

  return { text, isStreaming, error, startStream, stopStream, reset };
}
