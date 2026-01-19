/**
 * Stock Quote API Route
 *
 * Endpoint: GET /api/stock/quote?symbol=AAPL
 *
 * This route fetches real-time stock quotes using Yahoo Finance (primary)
 * with Finnhub as fallback. Supports stocks, ETFs, bonds, and mutual funds.
 *
 * Request:
 *   - Method: GET
 *   - Query Parameters:
 *     - symbol (required): Stock ticker symbol (e.g., "AAPL", "VOO", "BND")
 *
 * Response (200 OK):
 *   {
 *     "symbol": "AAPL",
 *     "name": "Apple Inc.",
 *     "currentPrice": 178.50,
 *     "change": 2.35,
 *     "changePercent": 1.33,
 *     "high": 179.20,
 *     "low": 176.10,
 *     "open": 176.50,
 *     "previousClose": 176.15,
 *     "type": "EQUITY",
 *     "source": "yahoo"
 *   }
 *
 * Error Responses:
 *   - 400 Bad Request: Missing or invalid symbol parameter
 *   - 404 Not Found: Stock symbol not found
 *   - 500 Internal Server Error: Unexpected error
 */

import { NextResponse } from 'next/server';
import { getStockQuote, StockQuoteData } from '@/lib/api/stock-api';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/** Cache duration in seconds for CDN and browser caching */
const CACHE_DURATION_SECONDS = 15;

/** Regex pattern for valid stock symbols (1-10 chars, letters and some punctuation) */
const SYMBOL_PATTERN = /^[A-Z0-9.\-^]{1,10}$/;

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
 * Validates and normalizes a stock symbol.
 */
function validateSymbol(symbol: string | null): {
  isValid: boolean;
  normalizedSymbol?: string;
  errorMessage?: string;
} {
  if (!symbol) {
    return {
      isValid: false,
      errorMessage: 'Missing required parameter: symbol',
    };
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!normalizedSymbol) {
    return {
      isValid: false,
      errorMessage: 'Symbol cannot be empty.',
    };
  }

  // Allow broader symbol format for international stocks, ETFs, etc.
  if (!SYMBOL_PATTERN.test(normalizedSymbol)) {
    return {
      isValid: false,
      errorMessage: 'Invalid symbol format. Must be 1-10 characters (letters, numbers, periods, hyphens).',
    };
  }

  return {
    isValid: true,
    normalizedSymbol,
  };
}

/**
 * Maps errors to appropriate HTTP responses.
 */
function mapErrorToResponse(error: unknown): { status: number; message: string } {
  if (!(error instanceof Error)) {
    return {
      status: 500,
      message: 'An unexpected error occurred while fetching the stock quote.',
    };
  }

  const errorMessage = error.message;

  // Not found errors
  if (errorMessage.includes('No data found') || errorMessage.includes('NOT_FOUND') || errorMessage.includes('Invalid symbol')) {
    return {
      status: 404,
      message: errorMessage,
    };
  }

  // Rate limit errors
  if (errorMessage.includes('Rate limit')) {
    return {
      status: 429,
      message: 'Rate limit exceeded. Please wait a moment before trying again.',
    };
  }

  // Generic server error
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
 * Uses Yahoo Finance as primary source (no API key required) with
 * Finnhub as fallback for better reliability.
 */
export async function GET(request: Request): Promise<NextResponse<StockQuoteData | ErrorResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const rawSymbol = searchParams.get('symbol');

    const validation = validateSymbol(rawSymbol);
    if (!validation.isValid) {
      return createErrorResponse(validation.errorMessage!, 400);
    }

    // Fetch quote using unified API (Yahoo Finance + Finnhub)
    const quote = await getStockQuote(validation.normalizedSymbol!);

    return NextResponse.json(quote, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION_SECONDS}, stale-while-revalidate=${CACHE_DURATION_SECONDS * 2}`,
      },
    });
  } catch (error) {
    console.error('[API] Stock quote error:', error);

    const { status, message } = mapErrorToResponse(error);
    return createErrorResponse(message, status);
  }
}
