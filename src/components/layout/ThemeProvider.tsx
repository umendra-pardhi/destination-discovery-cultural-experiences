/* ============================================================
   Wanderlore — ThemeProvider
   ============================================================ */
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
  mounted: false,
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}
