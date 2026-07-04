import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { NAV_LINKS, APP_TAGLINE, APP_DESCRIPTION } from '@/lib/constants';
import { ArrowRight, Sparkles, Bot, Globe } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero} aria-label="Welcome section">
        <div className={styles.heroContent}>
          <span className={styles.badge}><Sparkles size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Gemini 2.5 Flash Powered</span>
          <h1 className={styles.title}>
            Discover the <span className="gradient-text">Stories</span> Behind Every Destination
          </h1>
          <p className={styles.description}>
            {APP_DESCRIPTION}
          </p>
          <div className={styles.ctas}>
            <Link href="/discover">
              <Button size="lg" className={styles.ctaBtn}>
                Start Exploring
              </Button>
            </Link>
            <Link href="/companion">
              <Button variant="outline" size="lg" className={styles.ctaBtn}>
                Chat with Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`${styles.featuresSection} section`} id="features" aria-label="Platform capabilities">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Travel Deeply, <span className="gradient-text">Respect Fully</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Experience seven tailored Generative AI modules that connect you with genuine local cultures.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {NAV_LINKS.map((link) => {
              // Custom Descriptions for landing page cards
              const descriptions: Record<string, string> = {
                '/discover': 'Get destination ideas tailored to your custom interests, budget, and travel style.',
                '/hidden-gems': 'Ditch the tourist traps. Discover lesser-known artisan workshops, viewpoints, and local secrets.',
                '/stories': 'Read captivating, authentic legends and histories from professional-grade AI narrative storytelling.',
                '/festivals': 'Find cultural celebrations, traditional festivals, and rules of engagement for respectful visitation.',
                '/heritage': 'Deep dive into UNESCO sites and historical monuments with expert guides and photography tips.',
                '/companion': 'Chat with Wanderlore, your live cultural travel companion for real-time translation and etiquette queries.',
                '/itinerary': 'Construct personalized day-by-day itineraries packed with authentic spots and culinary picks.',
              };

              return (
                <Card key={link.href} hoverable className={styles.featureCard}>
                  <div className={styles.cardIcon}><DynamicIcon name={link.iconName} size={28} /></div>
                  <h3 className={styles.cardTitle}>{link.label}</h3>
                  <p className={styles.cardDesc}>
                    {descriptions[link.href] || 'Explore this cultural feature with custom AI prompts.'}
                  </p>
                  <Link href={link.href} className={styles.cardLink}>
                    Explore Feature <ArrowRight size={16} />
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Companion Showcase */}
      <section className={`${styles.ctaShowcase} section`} aria-label="Interactive guide preview">
        <div className="container">
          <div className={styles.showcaseInner}>
            <div className={styles.showcaseContent}>
              <span className={styles.badge}><Bot size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Meet Wanderlore</span>
              <h2 className={styles.showcaseTitle}>
                Your Expert <span className="gradient-text">Cultural Companion</span>
              </h2>
              <p className={styles.showcaseDesc}>
                Whether you need to know how to order street food respectfully in Oaxaca, the meaning behind Kyoto's shrines, or useful local phrases, Wanderlore is ready to help 24/7.
              </p>
              <Link href="/companion" style={{ width: 'max-content', marginTop: 'var(--space-md)' }}>
                <Button variant="outline" size="md">
                  Start Chatting Now
                </Button>
              </Link>
            </div>

            <div className={`${styles.companionPreview} glass`}>
              <div className={styles.previewHeader}>
                <div className={styles.previewAvatar}><Bot size={22} /></div>
                <div>
                  <div className={styles.previewName}>Wanderlore</div>
                  <div className={styles.previewBadge}>online</div>
                </div>
              </div>
              <div className={styles.previewMessages}>
                <div className={styles.previewBubble} style={{ alignSelf: 'flex-start' }}>
                  Hello explorer! <Globe size={16} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> Are you planning a trip? Ask me about local customs, language helpers, or regional highlights.
                </div>
                <div className={styles.previewBubble} style={{ alignSelf: 'flex-end', background: 'var(--accent-primary)', color: '#1a1a1a' }}>
                  What is a local greeting in Kyoto, and what is its cultural meaning?
                </div>
                <div className={styles.previewBubble} style={{ alignSelf: 'flex-start' }}>
                  In Kyoto, locals use <strong>"Okini"</strong> (おきに) to say thank you. It has a warm, polite Kyoto dialect tone that reflects merchant culture and kindness.
                </div>
              </div>
              <div className={styles.previewInput}>
                <span>Ask about local customs, food or etiquette...</span>
                <span className={styles.previewSend}>Send</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
