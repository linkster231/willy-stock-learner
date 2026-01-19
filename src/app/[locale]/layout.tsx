/**
 * Locale Layout
 *
 * Wraps all pages within a locale (e.g., /en/*, /es/*).
 * Provides i18n context and shared layout components.
 */

import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

/**
 * Generate static params for all supported locales.
 * This enables static generation of locale-specific pages.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Layout component for locale-specific pages.
 * Validates locale and provides translations.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Await params (Next.js 15 change)
  const { locale } = await params;

  // Validate that the locale is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for this locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Set HTML lang attribute for accessibility */}
      <html lang={locale}>
        <body>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>

          {/* Header navigation (visible on all screen sizes) */}
          <Header />

          {/* Main content area */}
          <main
            id="main-content"
            className="min-h-screen bg-gray-50 pb-16 pt-16 md:pb-0"
          >
            {children}
          </main>

          {/* Bottom navigation (mobile only) */}
          <BottomNav />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
