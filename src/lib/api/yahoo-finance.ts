/**
 * Yahoo Finance API Wrapper (using yahoo-finance2)
 *
 * This module provides a robust interface to Yahoo Finance with:
 * - Stock/ETF/Bond quote fetching
 * - Symbol search by name or ticker
 * - No API key required (completely free)
 * - In-memory caching to reduce API calls
 *
 * @see https://github.com/gadicc/node-yahoo-finance2
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const yahooFinance = require('yahoo-finance2').default;

// =============================================================================
// NORMALIZED TYPES (Application-friendly format)
// =============================================================================

/**
 * Normalized quote data with human-readable field names.
 */
export interface YahooQuote {
  /** Stock ticker symbol (uppercase) */
  symbol: string;
  /** Company/security name */
  name: string;
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
  /** Market cap (if available) */
  marketCap?: number;
  /** 52 week high */
  fiftyTwoWeekHigh?: number;
  /** 52 week low */
  fiftyTwoWeekLow?: number;
  /** Security type */
  type: string;
  /** Exchange */
  exchange?: string;
}

/**
 * Normalized search result with human-readable field names.
 */
export interface YahooSearchResult {
  /** Stock ticker symbol */
  symbol: string;
  /** Company/security name */
  name: string;
  /** Security type (e.g., "EQUITY", "ETF", "MUTUALFUND") */
  type: string;
  /** Exchange name */
  exchange?: string;
  /** Exchange display name */
  exchangeDisplay?: string;
}

// =============================================================================
// CUSTOM ERROR CLASS
// =============================================================================

/**
 * Custom error class for Yahoo Finance API errors.
 */
export class YahooFinanceError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_SYMBOL' | 'API_ERROR' | 'NOT_FOUND'
  ) {
    super(message);
    this.name = 'YahooFinanceError';
  }
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/** Cache TTL in milliseconds (30 seconds for quotes) */
const QUOTE_CACHE_DURATION_MS = 30 * 1000;

/** Cache TTL in milliseconds (5 minutes for search - more stable) */
const SEARCH_CACHE_DURATION_MS = 5 * 60 * 1000;

/** Maximum number of search results to return */
const MAX_SEARCH_RESULTS = 15;

// =============================================================================
// CACHE IMPLEMENTATION
// =============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp >= entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

// Cleanup expired entries periodically
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        cache.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  if (typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref();
  }
}

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Fetches real-time stock quote data from Yahoo Finance.
 *
 * @param symbol - Stock ticker symbol (e.g., "AAPL", "MSFT", "BND")
 * @returns Promise resolving to normalized quote data
 * @throws {YahooFinanceError} If invalid symbol or API error
 */
export async function getYahooQuote(symbol: string): Promise<YahooQuote> {
  const normalizedSymbol = symbol.toUpperCase().trim();

  if (!normalizedSymbol) {
    throw new YahooFinanceError('Stock symbol cannot be empty', 'INVALID_SYMBOL');
  }

  const cacheKey = `yahoo-quote:${normalizedSymbol}`;
  const cached = getCached<YahooQuote>(cacheKey);
  if (cached) return cached;

  try {
    const quote = await yahooFinance.quote(normalizedSymbol);

    if (!quote || !quote.regularMarketPrice) {
      throw new YahooFinanceError(
        `No data found for symbol: ${normalizedSymbol}`,
        'NOT_FOUND'
      );
    }

    const normalized: YahooQuote = {
      symbol: quote.symbol || normalizedSymbol,
      name: quote.shortName || quote.longName || normalizedSymbol,
      currentPrice: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      high: quote.regularMarketDayHigh || 0,
      low: quote.regularMarketDayLow || 0,
      open: quote.regularMarketOpen || 0,
      previousClose: quote.regularMarketPreviousClose || 0,
      marketCap: quote.marketCap,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      type: quote.quoteType || 'EQUITY',
      exchange: quote.exchange,
    };

    setCache(cacheKey, normalized, QUOTE_CACHE_DURATION_MS);
    return normalized;
  } catch (error) {
    if (error instanceof YahooFinanceError) throw error;

    const message = error instanceof Error ? error.message : 'Unknown error';

    // Handle specific yahoo-finance2 errors
    if (message.includes('No fundamentals data found') || message.includes('Quote not found')) {
      throw new YahooFinanceError(
        `No data found for symbol: ${normalizedSymbol}`,
        'NOT_FOUND'
      );
    }

    throw new YahooFinanceError(
      `Failed to fetch quote for ${normalizedSymbol}: ${message}`,
      'API_ERROR'
    );
  }
}

/**
 * Searches for stocks, ETFs, bonds, and mutual funds by symbol or company name.
 *
 * @param query - Search query (symbol or company name)
 * @returns Promise resolving to array of matching securities
 * @throws {YahooFinanceError} If API error
 */
export async function searchYahoo(query: string): Promise<YahooSearchResult[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery || normalizedQuery.length < 1) {
    return [];
  }

  const cacheKey = `yahoo-search:${normalizedQuery.toLowerCase()}`;
  const cached = getCached<YahooSearchResult[]>(cacheKey);
  if (cached) return cached;

  try {
    const results = await yahooFinance.search(normalizedQuery, {
      quotesCount: MAX_SEARCH_RESULTS,
      newsCount: 0,
    });

    if (!results || !results.quotes || results.quotes.length === 0) {
      // Cache empty results too to avoid repeated API calls
      setCache(cacheKey, [], SEARCH_CACHE_DURATION_MS);
      return [];
    }

    // Map to normalized format and filter out non-tradeable items
    const normalized: YahooSearchResult[] = results.quotes
      .filter((item: { symbol?: string; quoteType?: string; isYahooFinance?: boolean }) => {
        // Include equities, ETFs, mutual funds, and indices
        const validTypes = ['EQUITY', 'ETF', 'MUTUALFUND', 'INDEX', 'FUTURE', 'CURRENCY'];
        return item.symbol && (validTypes.includes(item.quoteType || '') || item.isYahooFinance);
      })
      .slice(0, MAX_SEARCH_RESULTS)
      .map((item: { symbol: string; shortname?: string; longname?: string; quoteType?: string; exchange?: string; exchDisp?: string }) => ({
        symbol: item.symbol,
        name: item.shortname || item.longname || item.symbol,
        type: item.quoteType || 'EQUITY',
        exchange: item.exchange,
        exchangeDisplay: item.exchDisp,
      }));

    setCache(cacheKey, normalized, SEARCH_CACHE_DURATION_MS);
    return normalized;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new YahooFinanceError(
      `Failed to search for "${normalizedQuery}": ${message}`,
      'API_ERROR'
    );
  }
}

/**
 * Clears all cached data.
 */
export function clearYahooCache(): void {
  cache.clear();
}
