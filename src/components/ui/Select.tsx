import { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly SelectOption[] | SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, options, error, id, ...props }, ref) => {
    const selectId = id || `select-${Date.now()}`;
    return (
      <div className={styles.wrapper}>
        {label ? (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        ) : null}
        <div className={styles.selectContainer}>
          <select
            ref={ref}
            id={selectId}
            className={`${styles.select} ${error ? styles.errorSelect : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className={styles.option}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error ? (
          <span id={`${selectId}-error`} className={styles.errorMessage} role="alert">
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
