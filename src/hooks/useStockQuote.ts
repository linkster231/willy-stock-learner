/**
 * Stock Quote Hook
 *
 * Custom React hooks for fetching stock market data using SWR (stale-while-revalidate).
 * Provides real-time quote data with automatic background refreshing and intelligent caching.
 *
 * Features:
 * - Auto-refresh quotes every 15 seconds when the browser tab is focused
 * - Request deduplication to prevent redundant API calls
 * - Graceful error handling with configurable retry logic
 * - TypeScript-first with full type safety
 *
 * @module useStockQuote
 */

'use client';

import useSWR from 'swr';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Stock quote data returned from the API.
 * Represents a snapshot of a stock's current trading information.
 */
export interface QuoteData {
  /** Stock ticker symbol (e.g., "AAPL", "GOOGL") */
  symbol: string;
  /** Current trading price in USD */
  currentPrice: number;
  /** Price change from previous close in USD */
  change: number;
  /** Price change as a percentage (e.g., 2.5 for 2.5%) */
  changePercent: number;
  /** Highest price during the current trading session */
  high: number;
  /** Lowest price during the current trading session */
  low: number;
  /** Opening price for the current trading session */
  open: number;
  /** Previous trading day's closing price */
  previousClose: number;
  /** Unix timestamp (milliseconds) when the quote was fetched */
  timestamp: number;
}

/**
 * Error response structure from the API.
 */
export interface QuoteError {
  message: string;
}

/**
 * Configuration options for the useStockQuote hook.
 */
export interface UseStockQuoteOptions {
  /**
   * Enable automatic background refresh of quote data.
   * When enabled, the quote will refresh at the specified interval
   * and when the browser window regains focus.
   * @default true
   */
  refreshEnabled?: boolean;

  /**
   * Interval between automatic refreshes in milliseconds.
   * Only applies when refreshEnabled is true.
   * @default 15000 (15 seconds)
   */
  refreshInterval?: number;
}

/**
 * Return value from the useStockQuote hook.
 */
export interface UseStockQuoteReturn {
  /** Quote data, undefined while loading or if fetch failed */
  quote: QuoteData | undefined;
  /** True during initial load (no cached data available) */
  isLoading: boolean;
  /** Error object if the fetch failed, undefined otherwise */
  error: Error | undefined;
  /** True when revalidating in the background (cached data may still be available) */
  isValidating: boolean;
  /** Function to manually trigger a refresh of the quote data */
  mutate: () => void;
}

/**
 * Stock search result from the search API.
 */
export interface SearchResult {
  /** Stock ticker symbol */
  symbol: string;
  /** Company name */
  name: string;
  /** Security type (e.g., "Equity", "ETF") */
  type: string;
}

/**
 * Return value from the useStockSearch hook.
 */
export interface UseStockSearchReturn {
  /** Array of search results, empty array if none found */
  results: SearchResult[];
  /** True while search is in progress */
  isLoading: boolean;
  /** Error object if the search failed, undefined otherwise */
  error: Error | undefined;
}

// =============================================================================
// FETCHER FUNCTIONS
// =============================================================================

/**
 * Generic fetcher function for SWR.
 * Handles the fetch request and error parsing for stock quote API calls.
 *
 * @param url - The API endpoint URL to fetch
 * @returns Promise resolving to the quote data
 * @throws Error with message from API or generic error message
 */
async function quoteFetcher(url: string): Promise<QuoteData> {
  const response = await fetch(url);

  if (!response.ok) {
    // Attempt to parse error message from response body
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to fetch quote: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetcher function for stock search API calls.
 * Similar to quoteFetcher but returns an array of search results.
 *
 * @param url - The API endpoint URL to fetch
 * @returns Promise resolving to an array of search results
 * @throws Error with message from API or generic error message
 */
async function searchFetcher(url: string): Promise<SearchResult[]> {
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to search stocks: ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook for fetching stock quotes with automatic refresh.
 *
 * Uses SWR for data fetching with the following default behavior:
 * - Refreshes every 15 seconds when the browser tab is focused
 * - Revalidates data when the window regains focus
 * - Revalidates when the network reconnects after being offline
 * - Retries failed requests up to 2 times with 5-second intervals
 * - Deduplicates identical requests within a 2-second window
 *
 * @param symbol - Stock ticker symbol to fetch (e.g., "AAPL"), or null to disable fetching
 * @param options - Configuration options for refresh behavior
 * @returns Object containing quote data, loading state, error, and mutate function
 *
 * @example
 * // Basic usage
 * const { quote, isLoading, error } = useStockQuote('AAPL');
 *
 * @example
 * // With custom refresh interval
 * const { quote } = useStockQuote('GOOGL', { refreshInterval: 30000 });
 *
 * @example
 * // Disable auto-refresh for static displays
 * const { quote } = useStockQuote('MSFT', { refreshEnabled: false });
 *
 * @example
 * // Conditional fetching (null disables the hook)
 * const { quote } = useStockQuote(selectedSymbol || null);
 */
export function useStockQuote(
  symbol: string | null,
  options: UseStockQuoteOptions = {}
): UseStockQuoteReturn {
  // Extract options with defaults
  const { refreshEnabled = true, refreshInterval = 15000 } = options;

  // Only fetch if we have a valid, non-empty symbol
  const shouldFetch = Boolean(symbol?.trim());

  // Build the API URL with URL-encoded symbol
  // When shouldFetch is false, passing null as the key disables the request
  const apiUrl = shouldFetch
    ? `/api/stock/quote?symbol=${encodeURIComponent(symbol!)}`
    : null;

  const { data, error, isLoading, isValidating, mutate } = useSWR<QuoteData, Error>(
    apiUrl,
    quoteFetcher,
    {
      // =======================================================================
      // SWR CONFIGURATION
      // =======================================================================

      // REFRESH INTERVAL
      // When refreshEnabled is true, automatically refetch data at this interval.
      // Set to 0 to disable interval-based refreshing.
      refreshInterval: refreshEnabled ? refreshInterval : 0,

      // REVALIDATE ON FOCUS
      // When true, automatically refetch when the browser window regains focus.
      // Useful for ensuring fresh data when users return to the tab.
      revalidateOnFocus: refreshEnabled,

      // REVALIDATE ON RECONNECT
      // When true, automatically refetch when the browser comes back online.
      // Always enabled to ensure data freshness after network interruptions.
      revalidateOnReconnect: true,

      // REVALIDATE IF STALE
      // When true, automatically revalidate stale data (data older than the
      // refresh interval) when it's accessed.
      revalidateIfStale: true,

      // ERROR RETRY COUNT
      // Number of times to retry a failed request.
      // Limited to 2 to avoid excessive API calls on persistent failures
      // (e.g., invalid symbol, rate limits, service outages).
      errorRetryCount: 2,

      // ERROR RETRY INTERVAL
      // Delay between retry attempts in milliseconds.
      // 5 seconds provides a reasonable backoff without being too slow.
      errorRetryInterval: 5000,

      // DEDUPING INTERVAL
      // Time window in milliseconds during which identical requests are merged.
      // Prevents redundant API calls when multiple components request the same
      // symbol simultaneously (e.g., QuoteDisplay and TradeForm both fetching AAPL).
      dedupingInterval: 2000,
    }
  );

  return {
    quote: data,
    isLoading,
    error,
    isValidating,
    mutate,
  };
}

/**
 * Hook for searching stocks by name or symbol.
 *
 * Optimized for search-as-you-type interfaces with the following behavior:
 * - Requires at least 1 character before making API requests
 * - Does NOT auto-refresh (search results are considered stable)
 * - Caches results for 30 seconds to improve UX for repeated searches
 * - Retries failed requests only once to provide quick feedback
 *
 * Note: For better UX, consider debouncing the query input before passing
 * it to this hook (e.g., using a 300ms debounce).
 *
 * @param query - Search query string (minimum 1 character to trigger search)
 * @returns Object containing search results array, loading state, and error
 *
 * @example
 * // Basic usage
 * const { results, isLoading, error } = useStockSearch(searchQuery);
 *
 * @example
 * // With debounced input
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 300);
 * const { results } = useStockSearch(debouncedQuery);
 */
export function useStockSearch(query: string): UseStockSearchReturn {
  // Require at least 1 character to avoid empty searches
  const shouldFetch = query.trim().length >= 1;

  // Build the API URL with URL-encoded query
  const apiUrl = shouldFetch
    ? `/api/stock/search?q=${encodeURIComponent(query)}`
    : null;

  const { data, error, isLoading } = useSWR<SearchResult[], Error>(
    apiUrl,
    searchFetcher,
    {
      // =======================================================================
      // SWR CONFIGURATION (Search-specific)
      // =======================================================================

      // REVALIDATE ON FOCUS
      // Disabled for search results - they don't change frequently and
      // revalidating on focus would cause jarring UI updates.
      revalidateOnFocus: false,

      // DEDUPING INTERVAL
      // Extended to 30 seconds for search results since stock listings
      // don't change frequently. This improves UX when users navigate
      // back and forth in search results.
      dedupingInterval: 30000,

      // ERROR RETRY COUNT
      // Limited to 1 retry for faster feedback on invalid searches.
      // Users can simply modify their query if the search fails.
      errorRetryCount: 1,
    }
  );

  return {
    // Return empty array instead of undefined for easier consumption
    results: data ?? [],
    isLoading,
    error,
  };
}
