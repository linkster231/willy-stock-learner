/**
 * PWA Web App Manifest
 *
 * Defines how the app appears when installed on a device.
 * Generated dynamically by Next.js.
 */

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // Full app name
    name: 'Willy Stock Learner',

    // Short name for home screen icon
    short_name: 'StockLearner',

    // App description
    description:
      'Learn stock market investing in English and Spanish. Practice with paper trading, use financial calculators, and master investing basics.',

    // Start URL when app is launched
    start_url: '/',

    // Display mode: standalone = no browser UI
    display: 'standalone',

    // Background color for splash screen
    background_color: '#ffffff',

    // Theme color for browser UI and status bar
    theme_color: '#2563eb', // Blue-600

    // Preferred orientation
    orientation: 'portrait',

    // App icons for different sizes
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],

    // Screenshots for app store listings (optional)
    screenshots: [
      {
        src: '/icons/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/icons/screenshot-narrow.png',
        sizes: '720x1280',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],

    // Categories for app stores
    categories: ['education', 'finance'],

    // Shortcuts for quick actions from home screen
    shortcuts: [
      {
        name: 'Calculators',
        short_name: 'Calc',
        url: '/en/calculators',
        icons: [{ src: '/icons/calculator.png', sizes: '96x96' }],
      },
      {
        name: 'Paper Trading',
        short_name: 'Trade',
        url: '/en/paper-trading',
        icons: [{ src: '/icons/trading.png', sizes: '96x96' }],
      },
    ],
  };
}
