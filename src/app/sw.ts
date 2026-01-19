/**
 * Service Worker for PWA
 *
 * Handles caching strategies for offline support.
 * Uses Serwist (successor to Workbox) for service worker management.
 */

import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry } from 'serwist';
import { Serwist } from 'serwist';

// Service worker global scope with Serwist config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const self: any;

/**
 * Initialize Serwist with default caching strategies
 */
const serwist = new Serwist({
  // Precache entries generated at build time
  precacheEntries: self.__SW_MANIFEST as (PrecacheEntry | string)[] | undefined,

  // Take control immediately without waiting for page reload
  skipWaiting: true,

  // Claim all clients immediately
  clientsClaim: true,

  // Enable navigation preload for faster page loads
  navigationPreload: true,

  // Use default runtime caching from Serwist
  runtimeCaching: defaultCache,
});

// Register all event listeners
serwist.addEventListeners();
