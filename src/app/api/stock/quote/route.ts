/**
 * Stock Quote API Route
 *
 * Endpoint: GET /api/stock/quote?symbol=AAPL
 *
 * This route proxies requests to the Finnhub API to fetch real-time stock quotes.
 * It includes server-side caching to reduce API calls and improve response times.
 *
 * Request:
 *   - Method: GET
 *   - Query Parameters:
 *     - symbol (required): Stock ticker symbol (1-5 uppercase letters, e.g., "AAPL", "MSFT")
 *
 * Response (200 OK):
 *   {
 *     "symbol": "AAPL",
 *     "currentPrice": 178.50,
 *     "change": 2.35,
 *     "changePercent": 1.33,
 *     "high": 179.20,
 *     "low": 176.10,
 *     "open": 176.50,
 *     "previousClose": 176.15,
 *     "timestamp": 1705000000000
 *   }
 *
 * Error Responses:
 *   - 400 Bad Request: Missing or invalid symbol parameter
 *   - 404 Not Found: Stock symbol not found
 *   - 429 Too Many Requests: Rate limit exceeded
 *   - 503 Service Unavailable: API key not configured
 *   - 500 Internal Server Error: Unexpected error
 */

import { NextResponse } from 'next/server';
import { getQuote, NormalizedQuote } from '@/lib/api/finnhub';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/** Cache duration in seconds for CDN and browser caching */
const CACHE_DURATION_SECONDS = 15;

/** Regex pattern for valid stock symbols (1-5 uppercase letters) */
const SYMBOL_PATTERN = /^[A-Z]{1,5}$/;

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

/** Error response structure returned by this API */
interface ErrorResponse {
  error: string;
}

/** Successful response structure (re-exported from finnhub for documentation) */
type QuoteResponse = NormalizedQuote;

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
 * Validates and normalizes a stock symbol.
 *
 * @param symbol - Raw symbol from query parameter
 * @returns Object with isValid flag and normalized symbol or error message
 */
function validateSymbol(symbol: string | null): {
  isValid: boolean;
  normalizedSymbol?: string;
  errorMessage?: string;
} {
  // Check if symbol is provided
  if (!symbol) {
    return {
      isValid: false,
      errorMessage: 'Missing required parameter: symbol',
    };
  }

  // Normalize: trim whitespace and convert to uppercase
  const normalizedSymbol = symbol.trim().toUpperCase();

  // Validate format (1-5 uppercase letters only)
  if (!SYMBOL_PATTERN.test(normalizedSymbol)) {
    return {
      isValid: false,
      errorMessage: 'Invalid symbol format. Must be 1-5 letters (e.g., AAPL, MSFT).',
    };
  }

  return {
    isValid: true,
    normalizedSymbol,
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
      message: 'An unexpected error occurred while fetching the stock quote.',
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

  // Invalid or unknown stock symbol
  if (errorMessage.includes('Invalid symbol')) {
    return {
      status: 404,
      message: errorMessage, // Pass through the specific message (includes symbol)
    };
  }

  // API key configuration error (don't expose internal details to client)
  if (errorMessage.includes('FINNHUB_API_KEY')) {
    return {
      status: 503,
      message: 'Stock quote service is temporarily unavailable. Please try again later.',
    };
  }

  // Generic server error for unhandled cases
  return {
    status: 500,
    message: 'Failed to fetch stock quote. Please try again.',
  };
}

// -----------------------------------------------------------------------------
// Route Handler
// -----------------------------------------------------------------------------

/**
 * GET handler for fetching stock quotes.
 *
 * Validates the symbol parameter, fetches the quote from Finnhub,
 * and returns the normalized quote data with appropriate cache headers.
 */
export async function GET(request: Request): Promise<NextResponse<QuoteResponse | ErrorResponse>> {
  try {
    // Extract symbol from query parameters
    const { searchParams } = new URL(request.url);
    const rawSymbol = searchParams.get('symbol');

    // Validate the symbol parameter
    const validation = validateSymbol(rawSymbol);
    if (!validation.isValid) {
      return createErrorResponse(validation.errorMessage!, 400);
    }

    // Fetch quote from Finnhub API (includes internal caching)
    const quote = await getQuote(validation.normalizedSymbol!);

    // Return successful response with cache headers
    // - s-maxage: CDN cache duration
    // - stale-while-revalidate: Allow serving stale content while revalidating
    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
      },
    });
  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('[API] Stock quote error:', error);

    // Map error to appropriate response
    const { status, message } = mapErrorToResponse(error);
    return createErrorResponse(message, status);
  }
}
