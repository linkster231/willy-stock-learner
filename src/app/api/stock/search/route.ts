/**
 * Stock Search API Route
 *
 * Endpoint: GET /api/stock/search?q=apple
 *
 * This route searches for stocks, ETFs, bonds, and mutual funds using
 * Yahoo Finance (primary) with Finnhub as fallback.
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
 *       "name": "Apple Inc.",
 *       "type": "EQUITY",
 *       "exchange": "NASDAQ",
 *       "source": "yahoo"
 *     },
 *     ...
 *   ]
 *
 * Error Responses:
 *   - 400 Bad Request: Missing or invalid query parameter
 *   - 500 Internal Server Error: Unexpected error
 */

import { NextResponse } from 'next/server';
import { searchAllStocks, StockSearchResult } from '@/lib/api/stock-api';

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

/** Error response structure */
interface ErrorResponse {
  error: string;
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Creates a standardized JSON error response.
 */
function createErrorResponse(message: string, status: number): NextResponse<ErrorResponse> {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Validates and normalizes a search query.
 */
function validateQuery(query: string | null): {
  isValid: boolean;
  normalizedQuery?: string;
  errorMessage?: string;
} {
  if (!query) {
    return {
      isValid: false,
      errorMessage: 'Missing required parameter: q (search query)',
    };
  }

  const normalizedQuery = query.trim();

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return {
      isValid: false,
      errorMessage: `Search query must be at least ${MIN_QUERY_LENGTH} character(s).`,
    };
  }

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

// -----------------------------------------------------------------------------
// Route Handler
// -----------------------------------------------------------------------------

/**
 * GET handler for searching stocks.
 *
 * Uses Yahoo Finance as primary source (no API key required, supports
 * stocks, ETFs, bonds, mutual funds) with Finnhub as fallback.
 */
export async function GET(request: Request): Promise<NextResponse<StockSearchResult[] | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q');

    const validation = validateQuery(rawQuery);
    if (!validation.isValid) {
      return createErrorResponse(validation.errorMessage!, 400);
    }

    // Search using unified API (Yahoo Finance + Finnhub)
    const results = await searchAllStocks(validation.normalizedQuery!);

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
      },
    });
  } catch (error) {
    console.error('[API] Stock search error:', error);
    return createErrorResponse('Failed to search for stocks. Please try again.', 500);
  }
}
