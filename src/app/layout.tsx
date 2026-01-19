/**
 * Root Layout
 *
 * Base HTML layout that wraps all pages.
 * The locale-specific layout handles i18n providers.
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * App metadata for SEO and PWA
 */
export const metadata: Metadata = {
  title: {
    default: 'Stock Learner - Learn Investing',
    template: '%s | Stock Learner',
  },
  description:
    'Learn stock market investing with interactive lessons, calculators, and paper trading. Available in English and Spanish.',
  keywords: [
    'stock market',
    'investing',
    'learn stocks',
    'paper trading',
    'financial calculator',
    'mercado de valores',
    'inversiones',
  ],
  authors: [{ name: 'Willy Stock Learner' }],
  creator: 'Willy Stock Learner',
  applicationName: 'Stock Learner',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Stock Learner',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.webmanifest',
};

/**
 * Viewport configuration for mobile optimization
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1e40af',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning on both html and body to prevent
    // hydration mismatch errors from browser extensions or dynamic content
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Font classes applied to a React-controlled div instead of body
            to prevent server/client className mismatch during hydration */}
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
