/**
 * Next.js Middleware for Internationalization
 *
 * Handles locale detection and URL prefixing.
 * Runs on every request before the page renders.
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

/**
 * Create the i18n middleware with our routing config.
 * This will:
 * - Detect the user's preferred locale from browser settings
 * - Redirect to locale-prefixed URLs (e.g., / -> /en/)
 * - Set the locale cookie for subsequent requests
 */
export default createMiddleware(routing);

/**
 * Matcher configuration
 * Defines which paths the middleware should run on.
 * Excludes:
 * - API routes (/api/...)
 * - Static files (*.css, *.js, *.png, etc.)
 * - Next.js internals (/_next/...)
 */
export const config = {
  matcher: [
    // Match all paths except:
    // - API routes
    // - Static files with extensions
    // - Next.js internals
    '/((?!api|_next|.*\\..*).*)',
  ],
};
