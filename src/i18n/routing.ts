/**
 * Internationalization Routing Configuration
 *
 * Defines the supported locales and default locale for the app.
 * Used by next-intl middleware and navigation helpers.
 */

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Routing configuration for i18n
 * - locales: Supported languages (English and Spanish)
 * - defaultLocale: Fallback language when none specified
 * - localePrefix: Always show locale in URL (e.g., /en/learn, /es/learn)
 */
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

/**
 * Navigation helpers that automatically handle locale prefixing
 * Use these instead of Next.js built-in Link/redirect/useRouter
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

// Type exports for use in other files
export type Locale = (typeof routing.locales)[number];
