/* ============================================================
   Wanderlore — Header Component
   ============================================================ */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeContext } from './ThemeProvider';
import { NAV_LINKS, APP_NAME } from '@/lib/constants';
import { Sun, Moon, Menu, X, Globe } from 'lucide-react';
import { DynamicIcon } from '../ui/DynamicIcon';
import styles from './Header.module.css';

export default function Header() {
  const { theme, toggleTheme, mounted } = useThemeContext();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={`${styles.header} glass`} role="banner">
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Wanderlore Home">
          <Globe className={styles.logoIcon} size={24} />
          <span className={styles.logoText}>{APP_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              <DynamicIcon name={link.iconName} size={16} />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {mounted && (
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={styles.menuToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className={`${styles.mobileNav} glass`} aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <DynamicIcon name={link.iconName} size={18} />
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
