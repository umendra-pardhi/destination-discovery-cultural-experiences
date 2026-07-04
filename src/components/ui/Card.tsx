import { HTMLAttributes, forwardRef } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverable = false, glass = true, padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${styles.card} 
          ${glass ? 'glass' : ''} 
          ${hoverable ? styles.hoverable : ''} 
          ${styles[padding]} 
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
