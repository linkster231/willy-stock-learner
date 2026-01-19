/**
 * Paper Trading Page
 *
 * Practice trading with $100,000 virtual money.
 * Shows portfolio summary, stock search, and holdings.
 *
 * Features:
 * - Real-time stock quotes via Finnhub API
 * - Buy/sell with position tracking
 * - Portfolio value calculation
 * - Reset with 3-reset limit and admin request system
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  StockSearch,
  QuoteDisplay,
  TradeForm,
  PortfolioTable,
  PortfolioSummary,
  ResetConfirmation,
  CandlestickChart,
} from '@/components/trading';

export default function PaperTradingPage() {
  const t = useTranslations('trading');

  // Selected stock for trading
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
  } | null>(null);

  // Handle stock selection from search
  const handleStockSelect = (symbol: string, name: string) => {
    setSelectedStock({ symbol, name });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Portfolio Summary */}
      <PortfolioSummary className="mb-6" />

      {/* Stock Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('trade.title')}</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0">
          <StockSearch
            onSelect={handleStockSelect}
            placeholder={t('trade.searchStock')}
          />

          {/* Selected Stock Quote, Chart & Trade Form */}
          {selectedStock && (
            <div className="mt-4 space-y-4">
              <QuoteDisplay
                symbol={selectedStock.symbol}
                name={selectedStock.name}
                showDetails
              />
              {/* Candlestick Chart - helps learn to read price patterns */}
              <CandlestickChart
                symbol={selectedStock.symbol}
                height={280}
                className="rounded-lg border border-gray-200 bg-white p-2"
              />
              <TradeForm
                symbol={selectedStock.symbol}
                name={selectedStock.name}
                onTradeComplete={() => setSelectedStock(null)}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('holdings')}</CardTitle>
        </CardHeader>
        <div className="p-4 pt-0">
          <PortfolioTable
            onPositionClick={(symbol) => setSelectedStock({ symbol, name: symbol })}
          />
        </div>
      </Card>

      {/* Reset Account - Uses new 2-step confirmation with reset limits */}
      <div className="mt-6 text-center">
        <ResetConfirmation
          onResetComplete={() => {
            // Optionally clear selected stock after reset
            setSelectedStock(null);
          }}
        />
      </div>
    </div>
  );
}
