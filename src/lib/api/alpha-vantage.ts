/**
 * Alpha Vantage API Wrapper
 *
 * Free tier: 25 requests/day (standard), 5 requests/minute
 * Good for: Stock quotes, search, fundamentals
 *
 * Get a free API key at: https://www.alphavantage.co/support/#api-key
 */

// =============================================================================
// TYPES
// =============================================================================

export interface AlphaVantageQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: number;
}

export interface AlphaVantageSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
}

// =============================================================================
// API FUNCTIONS
// =============================================================================

const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Get API key from environment
 */
function getApiKey(): string | null {
  return process.env.ALPHA_VANTAGE_API_KEY || null;
}

/**
 * Fetch stock quote from Alpha Vantage
 */
export async function getAlphaVantageQuote(symbol: string): Promise<AlphaVantageQuote> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('ALPHA_VANTAGE_API_KEY not configured');
  }

  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`);
  }

  const data = await response.json();

  // Check for API limit message
  if (data.Note || data.Information) {
    throw new Error('Alpha Vantage API limit reached');
  }

  const quote = data['Global Quote'];
  if (!quote || !quote['05. price']) {
    throw new Error(`No data found for symbol: ${symbol}`);
  }

  return {
    symbol: quote['01. symbol'],
    name: symbol, // Alpha Vantage doesn't return name in quote
    currentPrice: parseFloat(quote['05. price']) || 0,
    change: parseFloat(quote['09. change']) || 0,
    changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
    high: parseFloat(quote['03. high']) || 0,
    low: parseFloat(quote['04. low']) || 0,
    open: parseFloat(quote['02. open']) || 0,
    previousClose: parseFloat(quote['08. previous close']) || 0,
    volume: parseInt(quote['06. volume']) || 0,
  };
}

/**
 * Search for stocks using Alpha Vantage
 */
export async function searchAlphaVantage(query: string): Promise<AlphaVantageSearchResult[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('ALPHA_VANTAGE_API_KEY not configured');
  }

  const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`);
  }

  const data = await response.json();

  // Check for API limit message
  if (data.Note || data.Information) {
    throw new Error('Alpha Vantage API limit reached');
  }

  const matches = data.bestMatches || [];

  return matches.slice(0, 10).map((item: Record<string, string>) => ({
    symbol: item['1. symbol'],
    name: item['2. name'],
    type: item['3. type'],
    region: item['4. region'],
    currency: item['8. currency'],
  }));
}
