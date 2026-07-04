/* ============================================================
   Wanderlore — Footer Component
   ============================================================ */
import Link from 'next/link';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';
import { Globe, Sparkles, Cpu, Zap, Heart } from 'lucide-react';
import { DynamicIcon } from '../ui/DynamicIcon';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>
              <Globe size={20} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {APP_NAME}
            </span>
            <p className={styles.tagline}>
              Discover the stories behind every destination. AI-powered cultural travel companion.
            </p>
          </div>

          <nav className={styles.links} aria-label="Footer navigation">
            <h4 className={styles.linkTitle}>Explore</h4>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DynamicIcon name={link.iconName} size={14} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.poweredBy}>
            <h4 className={styles.linkTitle}>Powered By</h4>
            <p className={styles.techItem} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} className="gradient-text" /> Google Gemini AI
            </p>
            <p className={styles.techItem} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} /> Next.js 15
            </p>
            <p className={styles.techItem} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> Vercel
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            © {new Date().getFullYear()} {APP_NAME}. Built with <Heart size={12} fill="var(--error)" color="var(--error)" /> and AI for cultural discovery.
          </p>
          <p className={styles.disclaimer}>
            AI-generated content. Always verify travel information with official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
