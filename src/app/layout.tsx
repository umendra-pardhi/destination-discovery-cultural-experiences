import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description: APP_DESCRIPTION,
  keywords: [
    'cultural travel',
    'travel planning',
    'hidden gems',
    'cultural storytelling',
    'heritage sites',
    'local festivals',
    'itinerary planner',
    'sustainable travel',
  ],
  authors: [{ name: 'Wanderlore Team' }],
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
