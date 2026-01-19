/**
 * Advanced Portfolio Simulator Calculator
 *
 * Comprehensive portfolio building tool with:
 * - Stock selection with real dividend yields
 * - Compound growth calculations
 * - Dividend reinvestment option (DRIP)
 * - Tax impact estimation
 * - Multiple time horizons
 * - Detailed breakdown per stock
 *
 * Designed for users learning to invest - clear, educational interface.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

// Popular stocks with realistic data (as of 2024)
// Dividend yields are approximate annual yields
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple', emoji: '🍎', avgReturn: 25, dividendYield: 0.5, sector: 'Tech' },
  { symbol: 'GOOGL', name: 'Google', emoji: '🔍', avgReturn: 20, dividendYield: 0, sector: 'Tech' },
  { symbol: 'MSFT', name: 'Microsoft', emoji: '💻', avgReturn: 22, dividendYield: 0.8, sector: 'Tech' },
  { symbol: 'AMZN', name: 'Amazon', emoji: '📦', avgReturn: 18, dividendYield: 0, sector: 'Tech' },
  { symbol: 'TSLA', name: 'Tesla', emoji: '🚗', avgReturn: 30, dividendYield: 0, sector: 'Auto' },
  { symbol: 'NVDA', name: 'NVIDIA', emoji: '🎮', avgReturn: 35, dividendYield: 0.03, sector: 'Tech' },
  { symbol: 'META', name: 'Meta', emoji: '👤', avgReturn: 20, dividendYield: 0.4, sector: 'Tech' },
  { symbol: 'VOO', name: 'S&P 500 ETF', emoji: '📊', avgReturn: 10, dividendYield: 1.5, sector: 'ETF' },
  { symbol: 'VTI', name: 'Total Market', emoji: '🌐', avgReturn: 10, dividendYield: 1.4, sector: 'ETF' },
  { symbol: 'QQQ', name: 'Nasdaq 100', emoji: '💹', avgReturn: 15, dividendYield: 0.6, sector: 'ETF' },
  { symbol: 'SCHD', name: 'Dividend ETF', emoji: '💰', avgReturn: 8, dividendYield: 3.5, sector: 'ETF' },
  { symbol: 'VYM', name: 'High Div ETF', emoji: '💵', avgReturn: 7, dividendYield: 3.0, sector: 'ETF' },
  { symbol: 'DIS', name: 'Disney', emoji: '🏰', avgReturn: 8, dividendYield: 0, sector: 'Entertainment' },
  { symbol: 'KO', name: 'Coca-Cola', emoji: '🥤', avgReturn: 8, dividendYield: 3.1, sector: 'Consumer' },
  { symbol: 'MCD', name: "McDonald's", emoji: '🍔', avgReturn: 10, dividendYield: 2.2, sector: 'Consumer' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', emoji: '💊', avgReturn: 7, dividendYield: 3.0, sector: 'Healthcare' },
  { symbol: 'PG', name: 'Procter & Gamble', emoji: '🧴', avgReturn: 8, dividendYield: 2.4, sector: 'Consumer' },
  { symbol: 'JPM', name: 'JPMorgan', emoji: '🏦', avgReturn: 12, dividendYield: 2.5, sector: 'Finance' },
  { symbol: 'V', name: 'Visa', emoji: '💳', avgReturn: 15, dividendYield: 0.8, sector: 'Finance' },
  { symbol: 'O', name: 'Realty Income', emoji: '🏢', avgReturn: 5, dividendYield: 5.5, sector: 'REIT' },
];

interface PortfolioItem {
  symbol: string;
  name: string;
  emoji: string;
  amount: number;
  avgReturn: number;
  dividendYield: number;
  sector: string;
}

// Format currency for display
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format percentage
function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Calculate future value with compound growth
function calculateGrowth(
  principal: number,
  annualReturn: number,
  dividendYield: number,
  years: number,
  reinvestDividends: boolean
): {
  futureValue: number;
  totalDividends: number;
  yearlyBreakdown: Array<{
    year: number;
    value: number;
    dividends: number;
    totalDividends: number;
  }>;
} {
  let value = principal;
  let totalDividends = 0;
  const yearlyBreakdown = [];

  const effectiveReturn = reinvestDividends
    ? (annualReturn + dividendYield) / 100
    : annualReturn / 100;

  for (let year = 1; year <= years; year++) {
    const yearDividends = reinvestDividends ? 0 : value * (dividendYield / 100);
    value = value * (1 + effectiveReturn);
    totalDividends += yearDividends;

    yearlyBreakdown.push({
      year,
      value: Math.round(value),
      dividends: Math.round(yearDividends),
      totalDividends: Math.round(totalDividends),
    });
  }

  return {
    futureValue: Math.round(value),
    totalDividends: Math.round(totalDividends),
    yearlyBreakdown,
  };
}

// Tax calculation (simplified for NJ)
function calculateTax(gains: number, dividends: number): {
  capitalGainsTax: number;
  dividendTax: number;
  totalTax: number;
} {
  // Simplified: assuming long-term gains at 15% federal + 6% NJ
  const capitalGainsTax = gains > 0 ? gains * 0.21 : 0;
  // Qualified dividends at same rate
  const dividendTax = dividends * 0.21;
  return {
    capitalGainsTax: Math.round(capitalGainsTax),
    dividendTax: Math.round(dividendTax),
    totalTax: Math.round(capitalGainsTax + dividendTax),
  };
}

export default function PortfolioSimulatorPage() {
  const t = useTranslations('calculators.portfolio');

  // Portfolio state
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [years, setYears] = useState(10);
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [showTaxes, setShowTaxes] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Get unique sectors
  const sectors = useMemo(() => {
    return Array.from(new Set(POPULAR_STOCKS.map((s) => s.sector)));
  }, []);

  // Filtered stocks
  const filteredStocks = useMemo(() => {
    return selectedSector
      ? POPULAR_STOCKS.filter((s) => s.sector === selectedSector)
      : POPULAR_STOCKS;
  }, [selectedSector]);

  // Add stock to portfolio
  const addStock = (stock: (typeof POPULAR_STOCKS)[0]) => {
    if (portfolio.find((p) => p.symbol === stock.symbol)) {
      return;
    }
    setPortfolio([
      ...portfolio,
      {
        symbol: stock.symbol,
        name: stock.name,
        emoji: stock.emoji,
        amount: 1000,
        avgReturn: stock.avgReturn,
        dividendYield: stock.dividendYield,
        sector: stock.sector,
      },
    ]);
  };

  // Remove stock
  const removeStock = (symbol: string) => {
    setPortfolio(portfolio.filter((p) => p.symbol !== symbol));
  };

  // Update amount
  const updateAmount = (symbol: string, amount: number) => {
    setPortfolio(
      portfolio.map((p) => (p.symbol === symbol ? { ...p, amount } : p))
    );
  };

  // Calculate totals
  const results = useMemo(() => {
    const totalInvested = portfolio.reduce((sum, p) => sum + p.amount, 0);
    if (totalInvested === 0) return null;

    // Per-stock calculations
    const stockResults = portfolio.map((stock) => {
      const growth = calculateGrowth(
        stock.amount,
        stock.avgReturn,
        stock.dividendYield,
        years,
        reinvestDividends
      );
      return {
        ...stock,
        ...growth,
        gain: growth.futureValue - stock.amount,
      };
    });

    // Totals
    const totalFutureValue = stockResults.reduce((sum, s) => sum + s.futureValue, 0);
    const totalDividends = stockResults.reduce((sum, s) => sum + s.totalDividends, 0);
    const totalGain = totalFutureValue - totalInvested;

    // Weighted averages
    const weightedReturn =
      portfolio.reduce((sum, p) => sum + (p.amount / totalInvested) * p.avgReturn, 0);
    const weightedDividend =
      portfolio.reduce((sum, p) => sum + (p.amount / totalInvested) * p.dividendYield, 0);

    // Tax calculations
    const taxes = calculateTax(totalGain, totalDividends);

    // After-tax values
    const afterTaxFutureValue = totalFutureValue - taxes.totalTax;
    const afterTaxGain = totalGain - taxes.totalTax;

    return {
      totalInvested,
      totalFutureValue,
      totalDividends,
      totalGain,
      weightedReturn,
      weightedDividend,
      taxes,
      afterTaxFutureValue,
      afterTaxGain,
      stockResults,
    };
  }, [portfolio, years, reinvestDividends]);

  // Clear portfolio
  const clearPortfolio = () => {
    setPortfolio([]);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          {t('title') || '📊 Portfolio Simulator'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {t('subtitle') || 'Build your portfolio and see projected growth with dividends!'}
        </p>
      </div>

      {/* Sector Filter */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedSector === null ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setSelectedSector(null)}
        >
          All
        </Button>
        {sectors.map((sector) => (
          <Button
            key={sector}
            variant={selectedSector === sector ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedSector(sector)}
          >
            {sector}
          </Button>
        ))}
      </div>

      {/* Stock Picker */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">1️⃣</span>
            {t('pickStocks') || 'Pick Stocks to Add'}
          </CardTitle>
        </CardHeader>
        <div className="p-4 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredStocks.map((stock) => {
              const inPortfolio = portfolio.some((p) => p.symbol === stock.symbol);
              return (
                <button
                  key={stock.symbol}
                  onClick={() => addStock(stock)}
                  disabled={inPortfolio}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-lg border-2 transition-all text-left',
                    inPortfolio
                      ? 'border-green-500 bg-green-50 cursor-not-allowed'
                      : 'border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500'
                  )}
                >
                  <span className="text-2xl mb-1">{stock.emoji}</span>
                  <span className="font-bold text-sm text-gray-900">{stock.symbol}</span>
                  <span className="text-xs text-gray-500">{stock.name}</span>
                  <div className="mt-1 text-xs">
                    {stock.dividendYield > 0 ? (
                      <span className="text-green-600 font-medium">
                        💰 {stock.dividendYield}% div
                      </span>
                    ) : (
                      <span className="text-gray-400">No dividend</span>
                    )}
                  </div>
                  {inPortfolio && (
                    <span className="text-xs text-green-600 mt-1 font-medium">✓ Added</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Portfolio Builder */}
      {portfolio.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-2xl">2️⃣</span>
              {t('yourPortfolio') || 'Your Portfolio'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearPortfolio}>
              {t('clearAll') || 'Clear All'}
            </Button>
          </CardHeader>
          <div className="p-4 pt-0 space-y-3">
            {/* Stock List */}
            {portfolio.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{item.symbol}</div>
                  <div className="text-xs text-gray-500 truncate">{item.name}</div>
                  <div className="flex gap-2 text-xs mt-1">
                    <span className="text-blue-600">~{item.avgReturn}% growth</span>
                    {item.dividendYield > 0 && (
                      <span className="text-green-600">💰 {item.dividendYield}% div</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">$</span>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) =>
                      updateAmount(item.symbol, Math.max(0, Number(e.target.value)))
                    }
                    className="w-24 text-right"
                    min={0}
                    step={100}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStock(item.symbol)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  ✕
                </Button>
              </div>
            ))}

            {/* Settings */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              {/* Time Horizon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⏱️ {t('timeHorizon') || 'Investment Time Horizon'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-bold text-blue-600 min-w-[80px] text-center">
                    {years} {years === 1 ? 'year' : 'years'}
                  </span>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reinvestDividends}
                    onChange={(e) => setReinvestDividends(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    💰 {t('reinvestDividends') || 'Reinvest Dividends (DRIP)'}
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTaxes}
                    onChange={(e) => setShowTaxes(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    🧾 {t('showTaxes') || 'Show Tax Impact'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Summary Card */}
          <Card className="mb-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="text-xl text-green-900 flex items-center gap-2">
                <span className="text-2xl">3️⃣</span>
                {t('projectedResults') || 'Projected Results'}
              </CardTitle>
            </CardHeader>
            <div className="p-4 pt-0">
              {/* Main Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {t('invested') || 'Total Invested'}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(results.totalInvested)}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 text-center border border-green-200">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {t('futureValue') || `Value in ${years} Years`}
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(showTaxes ? results.afterTaxFutureValue : results.totalFutureValue)}
                  </div>
                  {showTaxes && (
                    <div className="text-xs text-gray-500">after taxes</div>
                  )}
                </div>

                <div className="bg-white rounded-lg p-4 text-center border border-blue-200">
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {t('totalGain') || 'Total Gain'}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    +{formatCurrency(showTaxes ? results.afterTaxGain : results.totalGain)}
                  </div>
                  <div className="text-xs text-blue-500">
                    {formatPercent(((showTaxes ? results.afterTaxGain : results.totalGain) / results.totalInvested) * 100)} return
                  </div>
                </div>

                {!reinvestDividends && (
                  <div className="bg-white rounded-lg p-4 text-center border border-yellow-200">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {t('totalDividends') || 'Total Dividends'}
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      +{formatCurrency(results.totalDividends)}
                    </div>
                    <div className="text-xs text-yellow-500">
                      passive income
                    </div>
                  </div>
                )}
              </div>

              {/* Portfolio Stats */}
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="text-gray-500">Avg Growth</div>
                    <div className="font-semibold text-blue-600">
                      {formatPercent(results.weightedReturn)}/yr
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Avg Dividend</div>
                    <div className="font-semibold text-green-600">
                      {formatPercent(results.weightedDividend)}/yr
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500"># of Stocks</div>
                    <div className="font-semibold">{portfolio.length}</div>
                  </div>
                  {showTaxes && (
                    <div>
                      <div className="text-gray-500">Est. Taxes</div>
                      <div className="font-semibold text-red-600">
                        -{formatCurrency(results.taxes.totalTax)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Per-Stock Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  📋 {t('stockBreakdown') || 'Per-Stock Breakdown'}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2">Stock</th>
                        <th className="text-right py-2 px-2">Invested</th>
                        <th className="text-right py-2 px-2">Future Value</th>
                        <th className="text-right py-2 px-2">Gain</th>
                        {!reinvestDividends && (
                          <th className="text-right py-2 px-2">Dividends</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {results.stockResults.map((stock) => (
                        <tr key={stock.symbol} className="border-b border-gray-100">
                          <td className="py-2 px-2">
                            <span className="mr-1">{stock.emoji}</span>
                            <span className="font-medium">{stock.symbol}</span>
                          </td>
                          <td className="text-right py-2 px-2">
                            {formatCurrency(stock.amount)}
                          </td>
                          <td className="text-right py-2 px-2 text-green-600 font-medium">
                            {formatCurrency(stock.futureValue)}
                          </td>
                          <td className="text-right py-2 px-2 text-blue-600">
                            +{formatCurrency(stock.gain)}
                          </td>
                          {!reinvestDividends && (
                            <td className="text-right py-2 px-2 text-yellow-600">
                              +{formatCurrency(stock.totalDividends)}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
            <strong>⚠️ {t('disclaimerTitle') || 'Important'}</strong>
            <p className="mt-1">
              {t('disclaimer') || 'Past performance does not guarantee future results. These projections are estimates based on historical averages and are for educational purposes only. The stock market involves risk and you could lose money. Always do your own research before investing.'}
            </p>
          </div>
        </>
      )}

      {/* Empty State */}
      {portfolio.length === 0 && (
        <Card className="text-center p-8 border-dashed border-2 border-gray-300">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {t('emptyTitle') || 'Start Building Your Portfolio'}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {t('emptyDescription') || 'Click on stocks above to add them. You\'ll see projected growth, dividends, and more!'}
          </p>
        </Card>
      )}

      {/* Tips */}
      <Card className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="p-6">
          <h2 className="mb-3 text-xl font-semibold">
            💡 {t('tipsTitle') || 'Smart Investing Tips'}
          </h2>
          <ul className="space-y-2 text-blue-100">
            <li>
              • <strong>Diversify:</strong> {t('tip1') || 'Mix growth stocks (AAPL, GOOGL) with dividend payers (KO, JNJ) and ETFs (VOO)'}
            </li>
            <li>
              • <strong>DRIP:</strong> {t('tip2') || 'Reinvesting dividends can significantly boost long-term returns through compounding'}
            </li>
            <li>
              • <strong>ETFs:</strong> {t('tip3') || 'VOO gives you 500 companies in one purchase - instant diversification!'}
            </li>
            <li>
              • <strong>Time:</strong> {t('tip4') || 'The longer you stay invested, the more compound growth works in your favor'}
            </li>
            <li>
              • <strong>Taxes:</strong> {t('tip5') || 'Hold investments for over 1 year for lower long-term capital gains rates'}
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
