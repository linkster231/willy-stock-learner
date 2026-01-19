/**
 * Next.js Configuration
 *
 * Configures Next.js with:
 * - next-intl for internationalization
 * - Serwist for PWA service worker
 * - Image optimization for external sources
 */

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from '@serwist/next';

// Initialize next-intl plugin
// Automatically detects src/i18n/request.ts
const withNextIntl = createNextIntlPlugin();

// Initialize Serwist (PWA) plugin
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  // Disable in development to avoid caching issues
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Enable typed routes for better TypeScript support (moved from experimental in Next.js 16)
  typedRoutes: true,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        // Company logos from Clearbit
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        // Placeholder images
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

// Apply plugins in order: next-intl first, then Serwist
export default withSerwist(withNextIntl(nextConfig));
