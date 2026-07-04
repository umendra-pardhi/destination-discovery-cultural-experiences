import { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
  style?: CSSProperties;
  className?: string;
}

export function Skeleton({ variant = 'text', width, height, count = 1, style, className = '' }: SkeletonProps) {
  const elements = Array.from({ length: count });

  return (
    <>
      {elements.map((_, idx) => (
        <div
          key={idx}
          className={`${styles.skeleton} ${styles[variant]} ${className}`}
          style={{
            width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
            height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
            ...style,
          }}
          role="status"
          aria-live="polite"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      ))}
    </>
  );
}
