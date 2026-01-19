/**
 * Paper Trading Page
 *
 * Practice trading with $100,000 virtual money.
 * Designed for older users learning to invest - larger text, clearer buttons.
 *
 * Features:
 * - Real-time stock quotes via Finnhub API
 * - Popular stock quick picks for easy selection
 * - Yahoo Finance chart integration
 * - Buy/sell with position tracking
 * - Portfolio value calculation
 * - Reset with 3-reset limit and admin request system
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  StockSearch,
  QuoteDisplay,
  TradeForm,
  PortfolioTable,
  PortfolioSummary,
  ResetConfirmation,
} from '@/components/trading';
import { cn } from '@/lib/utils';

// Popular stocks that most beginners recognize
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc', emoji: '🍎' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', emoji: '🔍' },
  { symbol: 'MSFT', name: 'Microsoft Corp', emoji: '💻' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', emoji: '📦' },
  { symbol: 'TSLA', name: 'Tesla Inc', emoji: '🚗' },
  { symbol: 'META', name: 'Meta Platforms', emoji: '👤' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', emoji: '🎮' },
  { symbol: 'DIS', name: 'Walt Disney Co', emoji: '🏰' },
  { symbol: 'KO', name: 'Coca-Cola Co', emoji: '🥤' },
  { symbol: 'MCD', name: "McDonald's Corp", emoji: '🍔' },
];

/**
 * Yahoo Finance Chart Component
 * Embeds a real-time interactive chart from Yahoo Finance
 */
function YahooFinanceChart({ symbol }: { symbol: string }) {
  const t = useTranslations('trading');

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          📈 {t('chart.title') || 'Price Chart'} - {symbol}
        </span>
        <a
          href={`https://finance.yahoo.com/quote/${symbol}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          {t('chart.viewOnYahoo') || 'View on Yahoo Finance'} ↗
        </a>
      </div>
      {/* TradingView Widget - Free and reliable */}
      <div className="relative w-full" style={{ height: '400px' }}>
        <iframe
          src={`https://www.tradingview.com/widgetembed/?symbol=${symbol}&interval=D&theme=light&style=1&locale=en&toolbar_bg=f1f3f6&enable_publishing=false&hide_top_toolbar=true&hide_legend=false&save_image=false&hide_volume=false&width=100%25&height=400`}
          width="100%"
          height="400"
          frameBorder="0"
          allowFullScreen
          className="w-full"
          title={`${symbol} stock chart`}
        />
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
        {t('chart.disclaimer') || 'Chart data may be delayed 15-20 minutes. For educational purposes only.'}
      </div>
    </div>
  );
}

export default function PaperTradingPage() {
  const t = useTranslations('trading');

  // Selected stock for trading
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
  } | null>(null);

  // Handle stock selection from search or quick pick
  const handleStockSelect = (symbol: string, name: string) => {
    setSelectedStock({ symbol, name });
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedStock(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Header - Larger text for older users */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary className="mb-6" />

      {/* Stock Selection Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{t('trade.title')}</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0 space-y-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('trade.searchLabel') || 'Search for any stock:'}
            </label>
            <StockSearch
              onSelect={handleStockSelect}
              placeholder={t('trade.searchStock')}
            />
          </div>

          {/* Popular Stocks Quick Picks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('trade.popularStocks') || 'Or pick a popular stock:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {POPULAR_STOCKS.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock.symbol, stock.name)}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-lg border-2 transition-all',
                    'hover:border-blue-500 hover:bg-blue-50',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    selectedStock?.symbol === stock.symbol
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  )}
                >
                  <span className="text-2xl mb-1">{stock.emoji}</span>
                  <span className="font-bold text-sm text-gray-900">{stock.symbol}</span>
                  <span className="text-xs text-gray-500 text-center leading-tight">
                    {stock.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Stock Details */}
      {selectedStock && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">
              {selectedStock.symbol} - {selectedStock.name}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ {t('page.clearSelection') || 'Clear'}
            </Button>
          </CardHeader>
          <div className="p-4 pt-0 space-y-4">
            {/* Quote Display - Shows current price */}
            <QuoteDisplay
              symbol={selectedStock.symbol}
              name={selectedStock.name}
              showDetails
            />

            {/* Yahoo Finance / TradingView Chart */}
            <YahooFinanceChart symbol={selectedStock.symbol} />

            {/* Trade Form */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {t('trade.placeOrder') || 'Place Your Order'}
              </h3>
              <TradeForm
                symbol={selectedStock.symbol}
                name={selectedStock.name}
                onTradeComplete={() => {
                  // Keep the stock selected after trade so user can see updated position
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t('holdings')}</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0">
          <PortfolioTable
            onPositionClick={(symbol) => setSelectedStock({ symbol, name: symbol })}
          />
        </div>
      </Card>

      {/* Reset Account */}
      <div className="mt-6 text-center">
        <ResetConfirmation
          onResetComplete={() => {
            setSelectedStock(null);
          }}
        />
      </div>
    </div>
  );
}
