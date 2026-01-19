/**
 * Finnhub API Wrapper
 *
 * This module provides a robust interface to the Finnhub Stock API with:
 * - Stock quote fetching (real-time prices)
 * - Stock symbol search functionality
 * - In-memory caching to reduce API calls
 * - Client-side rate limiting to stay within free tier limits (30 calls/sec)
 *
 * @see https://finnhub.io/docs/api for API documentation
 *
 * Architecture Overview:
 * ---------------------
 * 1. CACHING STRATEGY:
 *    - Uses a Map-based in-memory cache with TTL (Time-To-Live)
 *    - Cache entries expire after 15 seconds (configurable via CACHE_DURATION)
 *    - Automatic cleanup runs periodically to prevent memory leaks
 *    - Cache keys are prefixed by operation type (e.g., "quote:", "search:")
 *
 * 2. RATE LIMITING:
 *    - Implements a sliding window rate limiter
 *    - Tracks calls within a 1-second window (per Finnhub docs)
 *    - Rejects requests when limit (30 calls/sec) is reached
 *    - Window resets automatically after 1 second
 *
 * 3. ERROR HANDLING:
 *    - Custom error class (FinnhubError) for API-specific errors
 *    - Distinguishes between rate limit errors, invalid symbols, and network errors
 *    - All errors include helpful context for debugging
 */

// =============================================================================
// API RESPONSE TYPES (Raw Finnhub API format)
// =============================================================================

/**
 * Raw quote response from Finnhub /quote endpoint.
 * Field names are abbreviated as per Finnhub's API specification.
 *
 * @see https://finnhub.io/docs/api/quote
 */
export interface StockQuote {
  /** c = Current price */
  c: number;
  /** d = Change (absolute dollar amount) */
  d: number;
  /** dp = Delta percent (percentage change) */
  dp: number;
  /** h = High price of the day */
  h: number;
  /** l = Low price of the day */
  l: number;
  /** o = Open price of the day */
  o: number;
  /** pc = Previous close price */
  pc: number;
  /** t = Timestamp (Unix seconds) */
  t: number;
}

/**
 * Raw search response from Finnhub /search endpoint.
 *
 * @see https://finnhub.io/docs/api/symbol-search
 */
export interface SearchResult {
  /** Total number of results found */
  count: number;
  /** Array of matching securities */
  result: SearchResultItem[];
}

/**
 * Individual search result item from Finnhub.
 */
export interface SearchResultItem {
  /** Ticker symbol (e.g., "AAPL") */
  symbol: string;
  /** Company/security name (e.g., "Apple Inc") */
  description: string;
  /** Display symbol (may differ from symbol for some exchanges) */
  displaySymbol: string;
  /** Security type: "Common Stock", "ETF", "ADR", etc. */
  type: string;
}

// =============================================================================
// NORMALIZED TYPES (Application-friendly format)
// =============================================================================

/**
 * Normalized quote data with human-readable field names.
 * This is what our application components should use.
 */
export interface NormalizedQuote {
  /** Stock ticker symbol (uppercase) */
  symbol: string;
  /** Current trading price in USD */
  currentPrice: number;
  /** Absolute price change from previous close */
  change: number;
  /** Percentage change from previous close */
  changePercent: number;
  /** Highest price during current trading day */
  high: number;
  /** Lowest price during current trading day */
  low: number;
  /** Opening price for current trading day */
  open: number;
  /** Previous trading day's closing price */
  previousClose: number;
  /** Quote timestamp in milliseconds (JavaScript Date compatible) */
  timestamp: number;
}

/**
 * Normalized search result with human-readable field names.
 */
export interface NormalizedSearchResult {
  /** Stock ticker symbol */
  symbol: string;
  /** Company/security name */
  name: string;
  /** Security type (e.g., "Common Stock", "ETF") */
  type: string;
}

// =============================================================================
// CUSTOM ERROR CLASS
// =============================================================================

/**
 * Custom error class for Finnhub API errors.
 * Provides additional context about the error type for better error handling.
 */
export class FinnhubError extends Error {
  constructor(
    message: string,
    public readonly code: 'RATE_LIMIT' | 'INVALID_SYMBOL' | 'API_ERROR' | 'CONFIG_ERROR',
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'FinnhubError';
  }
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/** Base URL for all Finnhub API endpoints */
const BASE_URL = 'https://finnhub.io/api/v1';

/** Cache TTL in milliseconds (15 seconds balances freshness vs API limits) */
const CACHE_DURATION_MS = 15 * 1000;

/**
 * Maximum API calls allowed per rate limit window.
 * Finnhub documentation states 30 calls/second as the general limit.
 * We use a conservative per-minute limit to smooth out burst usage.
 * @see https://finnhub.io/docs/api/rate-limit
 */
const RATE_LIMIT_MAX_CALLS = 30;

/** Rate limit window duration in milliseconds (1 second per Finnhub docs) */
const RATE_LIMIT_WINDOW_MS = 1000;

/** Interval for cache cleanup in milliseconds (runs every 5 minutes) */
const CACHE_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/** Maximum number of search results to return */
const MAX_SEARCH_RESULTS = 10;

// =============================================================================
// CACHE IMPLEMENTATION
// =============================================================================

/**
 * Cache entry structure storing data with its creation timestamp.
 */
interface CacheEntry<T> {
  /** The cached data */
  data: T;
  /** Timestamp when the entry was created (milliseconds since epoch) */
  timestamp: number;
}

/**
 * In-memory cache using Map for O(1) lookups.
 *
 * Cache Strategy:
 * - Entries are keyed by operation type + parameter (e.g., "quote:AAPL")
 * - Each entry stores data + timestamp for TTL expiration
 * - Expired entries are lazily removed on access + periodically cleaned up
 * - This prevents unbounded memory growth from stale entries
 */
const cache = new Map<string, CacheEntry<unknown>>();

/**
 * Retrieves data from cache if it exists and hasn't expired.
 *
 * @template T - The expected type of the cached data
 * @param key - Cache key to look up
 * @returns The cached data if valid, null if expired or not found
 *
 * @example
 * const quote = getCached<NormalizedQuote>('quote:AAPL');
 * if (quote) {
 *   return quote; // Cache hit - no API call needed
 * }
 */
function getCached<T>(key: string): T | null {
  const entry = cache.get(key);

  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.timestamp >= CACHE_DURATION_MS;

  if (isExpired) {
    // Lazy cleanup: remove expired entry on access
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Stores data in the cache with the current timestamp.
 *
 * @param key - Cache key (should be prefixed with operation type)
 * @param data - Data to cache
 *
 * @example
 * setCache('quote:AAPL', normalizedQuote);
 * setCache('search:apple', searchResults);
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Removes all expired entries from the cache.
 * Called periodically to prevent memory leaks from accumulated stale entries.
 *
 * Time Complexity: O(n) where n is the number of cache entries
 */
function cleanupExpiredCacheEntries(): void {
  const now = Date.now();

  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp >= CACHE_DURATION_MS) {
      cache.delete(key);
    }
  }
}

// Schedule periodic cache cleanup to prevent memory leaks
// Uses setInterval with unref() to not prevent Node.js process from exiting
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(cleanupExpiredCacheEntries, CACHE_CLEANUP_INTERVAL_MS);
  // Allow the process to exit even if this timer is still active
  if (typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }
}

// =============================================================================
// RATE LIMITING IMPLEMENTATION
// =============================================================================

/**
 * Rate limiter state tracking API calls within the current window.
 *
 * Rate Limiting Strategy:
 * - Uses a simple fixed window approach (resets every 1 second per Finnhub docs)
 * - Tracks call count and window start time
 * - Rejects requests when limit is reached (30/sec)
 * - Window auto-resets when the time period expires
 *
 * Note: This is client-side rate limiting to proactively avoid 429 errors.
 * The server may still rate limit if multiple clients share the same API key.
 */
const rateLimitState = {
  /** Number of API calls made in the current window */
  callCount: 0,
  /** Timestamp when the current rate limit window started */
  windowStart: Date.now(),
};

/**
 * Checks if we can make another API call without exceeding rate limits.
 * Also handles window reset if the current window has expired.
 *
 * @returns true if a call can be made, false if rate limited
 *
 * @example
 * if (!checkRateLimit()) {
 *   throw new FinnhubError('Rate limit exceeded', 'RATE_LIMIT');
 * }
 */
function checkRateLimit(): boolean {
  const now = Date.now();
  const windowAge = now - rateLimitState.windowStart;

  // Reset the window if it has expired
  if (windowAge >= RATE_LIMIT_WINDOW_MS) {
    rateLimitState.callCount = 0;
    rateLimitState.windowStart = now;
  }

  return rateLimitState.callCount < RATE_LIMIT_MAX_CALLS;
}

/**
 * Records that an API call was made.
 * Should be called AFTER a successful API response to ensure accurate tracking.
 */
function recordApiCall(): void {
  rateLimitState.callCount++;
}

/**
 * Returns the number of API calls remaining in the current rate limit window.
 * Useful for debugging and monitoring.
 *
 * @returns Number of calls remaining before rate limiting kicks in
 */
export function getRateLimitRemaining(): number {
  // Ensure window is fresh before reporting
  checkRateLimit();
  return Math.max(0, RATE_LIMIT_MAX_CALLS - rateLimitState.callCount);
}

// =============================================================================
// API KEY MANAGEMENT
// =============================================================================

/**
 * Retrieves the Finnhub API key from environment variables.
 *
 * @throws {FinnhubError} If the API key is not configured
 * @returns The API key string
 *
 * @remarks
 * The API key should be set in the FINNHUB_API_KEY environment variable.
 * In Next.js, this can be configured in .env.local for development.
 */
function getApiKey(): string {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    throw new FinnhubError(
      'FINNHUB_API_KEY environment variable is not set. ' +
        'Please add it to your .env.local file.',
      'CONFIG_ERROR'
    );
  }

  return apiKey;
}

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Fetches real-time stock quote data from Finnhub.
 *
 * @param symbol - Stock ticker symbol (e.g., "AAPL", "MSFT", "GOOGL")
 * @returns Promise resolving to normalized quote data
 * @throws {FinnhubError} If rate limited, invalid symbol, or API error
 *
 * @example
 * try {
 *   const quote = await getQuote('AAPL');
 *   console.log(`Apple stock: $${quote.currentPrice}`);
 *   console.log(`Change: ${quote.changePercent.toFixed(2)}%`);
 * } catch (error) {
 *   if (error instanceof FinnhubError && error.code === 'RATE_LIMIT') {
 *     // Handle rate limiting - maybe show a message to wait
 *   }
 * }
 *
 * @remarks
 * - Results are cached for 15 seconds to reduce API calls
 * - Symbol is automatically converted to uppercase
 * - Finnhub returns all zeros for invalid symbols (this is detected and throws)
 */
export async function getQuote(symbol: string): Promise<NormalizedQuote> {
  // Normalize symbol to uppercase for consistent caching
  const normalizedSymbol = symbol.toUpperCase().trim();

  if (!normalizedSymbol) {
    throw new FinnhubError('Stock symbol cannot be empty', 'INVALID_SYMBOL');
  }

  const cacheKey = `quote:${normalizedSymbol}`;

  // Step 1: Check cache first to avoid unnecessary API calls
  const cached = getCached<NormalizedQuote>(cacheKey);
  if (cached) {
    return cached;
  }

  // Step 2: Verify we're within rate limits before making the request
  if (!checkRateLimit()) {
    throw new FinnhubError(
      'Rate limit exceeded. Please wait a moment before making more requests.',
      'RATE_LIMIT'
    );
  }

  // Step 3: Build the API URL with proper encoding
  const apiKey = getApiKey();
  const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(normalizedSymbol)}&token=${apiKey}`;

  // Step 4: Make the API request
  let response: Response;
  try {
    response = await fetch(url, {
      // Next.js ISR: revalidate server-side cache every 15 seconds
      next: { revalidate: 15 },
    });
  } catch (error) {
    // Network error (no internet, DNS failure, etc.)
    throw new FinnhubError(
      `Network error while fetching quote for ${normalizedSymbol}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'API_ERROR'
    );
  }

  // Step 5: Handle HTTP errors
  if (!response.ok) {
    if (response.status === 429) {
      throw new FinnhubError(
        'Finnhub API rate limit exceeded. Please wait before making more requests.',
        'RATE_LIMIT',
        429
      );
    }
    throw new FinnhubError(
      `Finnhub API error: ${response.status} ${response.statusText}`,
      'API_ERROR',
      response.status
    );
  }

  // Step 6: Record the successful API call for rate limiting
  recordApiCall();

  // Step 7: Parse the response
  const data: StockQuote = await response.json();

  // Step 8: Validate the response data
  // Finnhub returns all zeros for invalid/unknown symbols instead of an error
  const isInvalidSymbol = data.c === 0 && data.d === 0 && data.dp === 0 && data.pc === 0;
  if (isInvalidSymbol) {
    throw new FinnhubError(
      `Unknown or invalid stock symbol: ${normalizedSymbol}`,
      'INVALID_SYMBOL'
    );
  }

  // Step 9: Transform to normalized format with human-readable field names
  const normalized: NormalizedQuote = {
    symbol: normalizedSymbol,
    currentPrice: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
    // Convert Unix timestamp (seconds) to JavaScript timestamp (milliseconds)
    timestamp: data.t * 1000,
  };

  // Step 10: Cache the result for future requests
  setCache(cacheKey, normalized);

  return normalized;
}

/**
 * Searches for stocks by symbol or company name.
 *
 * @param query - Search query (symbol or company name)
 * @returns Promise resolving to array of matching stocks (max 10 results)
 * @throws {FinnhubError} If rate limited or API error
 *
 * @example
 * // Search by company name
 * const results = await searchStocks('apple');
 * // Returns: [{ symbol: 'AAPL', name: 'Apple Inc', type: 'Common Stock' }, ...]
 *
 * @example
 * // Search by partial symbol
 * const results = await searchStocks('MS');
 * // Returns: [{ symbol: 'MSFT', name: 'Microsoft Corp', type: 'Common Stock' }, ...]
 *
 * @remarks
 * - Results are filtered to only include Common Stocks and ETFs
 * - Maximum of 10 results returned (configurable via MAX_SEARCH_RESULTS)
 * - Empty or whitespace-only queries return an empty array
 * - Results are cached for 15 seconds (case-insensitive)
 */
export async function searchStocks(query: string): Promise<NormalizedSearchResult[]> {
  // Normalize query: trim whitespace and convert to lowercase for caching
  const normalizedQuery = query.trim();

  // Return empty array for empty queries (no need to call API)
  if (!normalizedQuery) {
    return [];
  }

  // Use lowercase for cache key to ensure case-insensitive caching
  const cacheKey = `search:${normalizedQuery.toLowerCase()}`;

  // Step 1: Check cache first
  const cached = getCached<NormalizedSearchResult[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Step 2: Verify rate limits
  if (!checkRateLimit()) {
    throw new FinnhubError(
      'Rate limit exceeded. Please wait a moment before making more requests.',
      'RATE_LIMIT'
    );
  }

  // Step 3: Build API URL
  const apiKey = getApiKey();
  const url = `${BASE_URL}/search?q=${encodeURIComponent(normalizedQuery)}&token=${apiKey}`;

  // Step 4: Make the API request
  let response: Response;
  try {
    response = await fetch(url, {
      next: { revalidate: 15 },
    });
  } catch (error) {
    throw new FinnhubError(
      `Network error while searching for "${normalizedQuery}": ${error instanceof Error ? error.message : 'Unknown error'}`,
      'API_ERROR'
    );
  }

  // Step 5: Handle HTTP errors
  if (!response.ok) {
    if (response.status === 429) {
      throw new FinnhubError(
        'Finnhub API rate limit exceeded. Please wait before making more requests.',
        'RATE_LIMIT',
        429
      );
    }
    throw new FinnhubError(
      `Finnhub API error: ${response.status} ${response.statusText}`,
      'API_ERROR',
      response.status
    );
  }

  // Step 6: Record the API call
  recordApiCall();

  // Step 7: Parse response
  const data: SearchResult = await response.json();

  // Step 8: Filter and transform results
  // - Only include Common Stocks and ETFs (exclude bonds, warrants, etc.)
  // - Limit to MAX_SEARCH_RESULTS to keep responses manageable
  // - Transform to normalized format with human-readable field names
  const allowedTypes = new Set(['Common Stock', 'ETF']);

  const normalized: NormalizedSearchResult[] = data.result
    .filter((item) => allowedTypes.has(item.type))
    .slice(0, MAX_SEARCH_RESULTS)
    .map((item) => ({
      symbol: item.symbol,
      name: item.description,
      type: item.type,
    }));

  // Step 9: Cache the results
  setCache(cacheKey, normalized);

  return normalized;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Clears all cached data.
 * Primarily useful for testing or when fresh data is required.
 *
 * @example
 * // In tests
 * beforeEach(() => {
 *   clearCache();
 * });
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Returns current cache statistics for debugging and monitoring.
 *
 * @returns Object containing cache size and other metrics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
