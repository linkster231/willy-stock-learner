/**
 * Server-side Request Configuration for i18n
 *
 * This file is automatically detected by next-intl and provides
 * locale-specific configuration for Server Components.
 */

import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

/**
 * Load messages for the current locale on each request.
 * This runs on the server and makes translations available to Server Components.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request (set by middleware)
  let locale = await requestLocale;

  // Validate the locale, fall back to default if invalid
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  // Dynamically import the messages for this locale
  // This keeps bundle size small by only loading needed translations
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    // Time zone for date formatting (US Eastern for NJ)
    timeZone: 'America/New_York',
    // Number and date formatting defaults
    formats: {
      number: {
        currency: {
          style: 'currency',
          currency: 'USD',
        },
        percent: {
          style: 'percent',
          minimumFractionDigits: 2,
        },
      },
    },
  };
});
