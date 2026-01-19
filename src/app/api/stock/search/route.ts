/**
 * Stock Search API Route
 *
 * Endpoint: GET /api/stock/search?q=apple
 *
 * This route proxies requests to the Finnhub API to search for stocks by
 * symbol or company name. Results are filtered to show only Common Stocks
 * and ETFs, limited to the top 10 matches.
 *
 * Request:
 *   - Method: GET
 *   - Query Parameters:
 *     - q (required): Search query string (1-50 characters)
 *
 * Response (200 OK):
 *   [
 *     {
 *       "symbol": "AAPL",
 *       "name": "Apple Inc",
 *       "type": "Common Stock"
 *     },
 *     {
 *       "symbol": "APLE",
 *       "name": "Apple Hospitality REIT Inc",
 *       "type": "Common Stock"
 *     }
 *   ]
 *
 * Error Responses:
 *   - 400 Bad Request: Missing or invalid query parameter
 *   - 429 Too Many Requests: Rate limit exceeded
 *   - 503 Service Unavailable: API key not configured
 *   - 500 Internal Server Error: Unexpected error
 */

import { NextResponse } from 'next/server';
import { searchStocks, NormalizedSearchResult } from '@/lib/api/finnhub';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/** Cache duration in seconds (search results change less frequently) */
const CACHE_DURATION_SECONDS = 60;

/** Minimum query length */
const MIN_QUERY_LENGTH = 1;

/** Maximum query length to prevent abuse */
const MAX_QUERY_LENGTH = 50;

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

/** Error response structure returned by this API */
interface ErrorResponse {
  error: string;
}

/** Successful response structure (array of search results) */
type SearchResponse = NormalizedSearchResult[];

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Creates a standardized JSON error response.
 *
 * @param message - Human-readable error message
 * @param status - HTTP status code
 * @returns NextResponse with error JSON and appropriate status
 */
function createErrorResponse(message: string, status: number): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Validates and normalizes a search query.
 *
 * @param query - Raw query from query parameter
 * @returns Object with isValid flag and normalized query or error message
 */
function validateQuery(query: string | null): {
  isValid: boolean;
  normalizedQuery?: string;
  errorMessage?: string;
} {
  // Check if query is provided
  if (!query) {
    return {
      isValid: false,
      errorMessage: 'Missing required parameter: q (search query)',
    };
  }

  // Normalize: trim whitespace
  const normalizedQuery = query.trim();

  // Check minimum length
  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Search query must be at least ${MIN_QUERY_LENGTH} character(s).`,
    };
  }

  // Check maximum length (prevent abuse and overly long queries)
  if (normalizedQuery.length > MAX_QUERY_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Search query must be ${MAX_QUERY_LENGTH} characters or less.`,
    };
  }

  return {
    isValid: true,
    normalizedQuery,
  };
}

/**
 * Maps known error types to appropriate HTTP status codes and messages.
 *
 * @param error - The caught error
 * @returns Object with status code and user-friendly message
 */
function mapErrorToResponse(error: unknown): { status: number; message: string } {
  if (!(error instanceof Error)) {
    return {
      status: 500,
      message: 'An unexpected error occurred while searching for stocks.',
    };
  }

  const errorMessage = error.message;

  // Rate limit exceeded (from Finnhub or our internal limiter)
  if (errorMessage.includes('Rate limit')) {
    return {
      status: 429,
      message: 'Rate limit exceeded. Please wait a moment before trying again.',
    };
  }

  // API key configuration error (don't expose internal details to client)
  if (errorMessage.includes('FINNHUB_API_KEY')) {
    return {
      status: 503,
      message: 'Stock search service is temporarily unavailable. Please try again later.',
    };
  }

  // Generic server error for unhandled cases
  return {
    status: 500,
    message: 'Failed to search for stocks. Please try again.',
  };
}

// -----------------------------------------------------------------------------
// Route Handler
// -----------------------------------------------------------------------------

/**
 * GET handler for searching stocks.
 *
 * Validates the search query, fetches results from Finnhub,
 * and returns the filtered/normalized results with appropriate cache headers.
 */
export async function GET(request: Request): Promise<NextResponse<SearchResponse | ErrorResponse>> {
  try {
    // Extract query from query parameters
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q');

    // Validate the query parameter
    const validation = validateQuery(rawQuery);
    if (!validation.isValid) {
      return createErrorResponse(validation.errorMessage!, 400);
    }

    // Search stocks via Finnhub API (includes internal caching and filtering)
    const results = await searchStocks(validation.normalizedQuery!);

    // Return successful response with cache headers
    // Search results are more stable, so we cache longer than quotes
    // - s-maxage: CDN cache duration
    // - stale-while-revalidate: Allow serving stale content while revalidating
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
      },
    });
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('[API] Stock search error:', error);

    // Map error to appropriate response
    const { status, message } = mapErrorToResponse(error);
    return createErrorResponse(message, status);
  }
}
