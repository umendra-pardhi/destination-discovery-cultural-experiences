import { ReactNode } from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  children: ReactNode;
}

export function Badge({ variant = 'secondary', children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}
