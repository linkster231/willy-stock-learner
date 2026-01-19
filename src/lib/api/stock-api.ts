/**
 * Unified Stock API
 *
 * This module provides a unified interface to fetch stock data from multiple sources:
 * - Primary: Yahoo Finance (no API key required, supports stocks, ETFs, bonds, mutual funds)
 * - Fallback: Finnhub (requires API key, good for real-time US stocks)
 *
 * Benefits:
 * - No API key required for basic functionality
 * - Supports ANY stock, ETF, bond, or mutual fund
 * - Automatic fallback if one source fails
 * - Better reliability through redundancy
 */

import { getYahooQuote, searchYahoo } from './yahoo-finance';
import { getQuote, searchStocks } from './finnhub';

// =============================================================================
// UNIFIED TYPES
// =============================================================================

/**
 * Unified quote data combining the best of both APIs
 */
export interface StockQuoteData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  type: string;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  exchange?: string;
  source: 'yahoo' | 'finnhub';
}

/**
 * Unified search result
 */
export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange?: string;
  source: 'yahoo' | 'finnhub';
}

// =============================================================================
// UNIFIED API FUNCTIONS
// =============================================================================

/**
 * Fetches stock quote data, trying Yahoo Finance first then Finnhub as fallback.
 *
 * @param symbol - Stock ticker symbol
 * @returns Promise resolving to quote data
 * @throws Error if both sources fail
 */
export async function getStockQuote(symbol: string): Promise<StockQuoteData> {
  const errors: string[] = [];

  // Try Yahoo Finance first (no API key needed)
  try {
    const yahooQuote = await getYahooQuote(symbol);
    return {
      symbol: yahooQuote.symbol,
      name: yahooQuote.name,
      currentPrice: yahooQuote.currentPrice,
      change: yahooQuote.change,
      changePercent: yahooQuote.changePercent,
      high: yahooQuote.high,
      low: yahooQuote.low,
      open: yahooQuote.open,
      previousClose: yahooQuote.previousClose,
      type: yahooQuote.type,
      marketCap: yahooQuote.marketCap,
      fiftyTwoWeekHigh: yahooQuote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: yahooQuote.fiftyTwoWeekLow,
      exchange: yahooQuote.exchange,
      source: 'yahoo',
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Yahoo: ${msg}`);
    console.warn(`[StockAPI] Yahoo Finance failed for ${symbol}:`, msg);
  }

  // Try Finnhub as fallback (requires API key)
  try {
    const finnhubQuote = await getQuote(symbol);
    return {
      symbol: finnhubQuote.symbol,
      name: finnhubQuote.symbol, // Finnhub doesn't return name in quote
      currentPrice: finnhubQuote.currentPrice,
      change: finnhubQuote.change,
      changePercent: finnhubQuote.changePercent,
      high: finnhubQuote.high,
      low: finnhubQuote.low,
      open: finnhubQuote.open,
      previousClose: finnhubQuote.previousClose,
      type: 'EQUITY',
      source: 'finnhub',
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`Finnhub: ${msg}`);
    console.warn(`[StockAPI] Finnhub failed for ${symbol}:`, msg);
  }

  // Both failed
  throw new Error(`Failed to fetch quote for ${symbol}. ${errors.join('; ')}`);
}

/**
 * Searches for stocks/ETFs/bonds, trying Yahoo Finance first then Finnhub as fallback.
 * Combines and deduplicates results from both sources for better coverage.
 *
 * @param query - Search query (symbol or company name)
 * @returns Promise resolving to array of search results
 */
export async function searchAllStocks(query: string): Promise<StockSearchResult[]> {
  const allResults: StockSearchResult[] = [];
  const seenSymbols = new Set<string>();

  // Try Yahoo Finance first (has better coverage including bonds and mutual funds)
  try {
    const yahooResults = await searchYahoo(query);
    for (const result of yahooResults) {
      if (!seenSymbols.has(result.symbol)) {
        seenSymbols.add(result.symbol);
        allResults.push({
          symbol: result.symbol,
          name: result.name,
          type: result.type,
          exchange: result.exchangeDisplay || result.exchange,
          source: 'yahoo',
        });
      }
    }
  } catch (error) {
    console.warn('[StockAPI] Yahoo search failed:', error instanceof Error ? error.message : error);
  }

  // Also try Finnhub to potentially find more results (only if we need more)
  if (allResults.length < 10) {
    try {
      const finnhubResults = await searchStocks(query);
      for (const result of finnhubResults) {
        if (!seenSymbols.has(result.symbol)) {
          seenSymbols.add(result.symbol);
          allResults.push({
            symbol: result.symbol,
            name: result.name,
            type: result.type === 'Common Stock' ? 'EQUITY' : result.type,
            source: 'finnhub',
          });
        }
      }
    } catch (error) {
      console.warn('[StockAPI] Finnhub search failed:', error instanceof Error ? error.message : error);
    }
  }

  // Sort: exact symbol matches first, then by relevance
  const queryUpper = query.toUpperCase().trim();
  allResults.sort((a, b) => {
    // Exact symbol match goes first
    const aExact = a.symbol === queryUpper ? -1 : 0;
    const bExact = b.symbol === queryUpper ? -1 : 0;
    if (aExact !== bExact) return aExact - bExact;

    // Starts with query next
    const aStarts = a.symbol.startsWith(queryUpper) ? -1 : 0;
    const bStarts = b.symbol.startsWith(queryUpper) ? -1 : 0;
    if (aStarts !== bStarts) return aStarts - bStarts;

    // ETFs and common stocks before others
    const typeOrder = ['EQUITY', 'ETF', 'MUTUALFUND', 'INDEX'];
    const aTypeIdx = typeOrder.indexOf(a.type);
    const bTypeIdx = typeOrder.indexOf(b.type);
    return (aTypeIdx === -1 ? 99 : aTypeIdx) - (bTypeIdx === -1 ? 99 : bTypeIdx);
  });

  return allResults.slice(0, 15);
}

/**
 * Validates if a symbol exists and returns basic info.
 *
 * @param symbol - Stock ticker to validate
 * @returns Object with isValid and quote data if valid
 */
export async function validateSymbol(symbol: string): Promise<{
  isValid: boolean;
  quote?: StockQuoteData;
  error?: string;
}> {
  try {
    const quote = await getStockQuote(symbol);
    return { isValid: true, quote };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Symbol not found',
    };
  }
}
