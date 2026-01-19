/**
 * Portfolio Table Component
 *
 * Displays portfolio holdings with current values and gain/loss.
 * Mobile-responsive: shows cards on small screens, table on larger.
 *
 * ZUSTAND SELECTOR PATTERNS USED:
 * ===============================
 * 1. For single values: Use a selector function directly
 *    const positions = useTradingStore(selectPositionsList);
 *
 * 2. For multiple values: Use useShallow to avoid infinite re-renders
 *    const { cash, calculatePortfolioValue } = useTradingStore(
 *      useShallow((state) => ({ cash: state.cash, calculatePortfolioValue: state.calculatePortfolioValue }))
 *    );
 *
 * 3. NEVER destructure directly from useTradingStore() without useShallow
 *    BAD:  const { cash, positions } = useTradingStore();  // Infinite loop!
 *    GOOD: const { cash, positions } = useTradingStore(useShallow(state => ({ cash: state.cash, positions: state.positions })));
 */

'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/react/shallow';
import { Card } from '@/components/ui/Card';
import { useStockQuote } from '@/hooks/useStockQuote';
import {
  useTradingStore,
  selectPositionsList,
  selectCash,
  type Position,
} from '@/stores/useTradingStore';
import { cn, formatCurrency } from '@/lib/utils';

interface PortfolioTableProps {
  /** Called when a position is clicked (to trade) */
  onPositionClick?: (symbol: string) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Portfolio holdings table with responsive design
 *
 * @example
 * <PortfolioTable onPositionClick={(symbol) => setSelectedStock(symbol)} />
 */
export function PortfolioTable({ onPositionClick, className }: PortfolioTableProps) {
  const t = useTranslations('trading');

  const positions = useTradingStore(selectPositionsList);

  if (positions.length === 0) {
    return (
      <Card className={cn('text-center py-8', className)}>
        <div className="text-gray-400">
          <svg
            className="mx-auto h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-sm">{t('noHoldings')}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Symbol
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Shares
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Avg Cost
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Current Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Market Value
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Gain/Loss
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {positions.map((position) => (
                  <PositionRow
                    key={position.symbol}
                    position={position}
                    onClick={() => onPositionClick?.(position.symbol)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {positions.map((position) => (
          <PositionCard
            key={position.symbol}
            position={position}
            onClick={() => onPositionClick?.(position.symbol)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Desktop table row for a position
 */
function PositionRow({
  position,
  onClick,
}: {
  position: Position;
  onClick?: () => void;
}) {
  const { quote, isLoading } = useStockQuote(position.symbol);

  // Calculate values
  const currentPrice = quote?.currentPrice ?? 0;
  const marketValue = position.shares * currentPrice;
  const gainLoss = marketValue - position.totalCost;
  const gainLossPercent = position.totalCost > 0 ? (gainLoss / position.totalCost) * 100 : 0;
  const isPositive = gainLoss >= 0;

  return (
    <tr
      className={cn(
        'transition-colors',
        onClick && 'cursor-pointer hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      <td className="px-4 py-3">
        <span className="font-semibold text-gray-900">{position.symbol}</span>
      </td>
      <td className="px-4 py-3 text-right text-gray-900">
        {position.shares}
      </td>
      <td className="px-4 py-3 text-right text-gray-600">
        {formatCurrency(position.averageCost)}
      </td>
      <td className="px-4 py-3 text-right text-gray-900">
        {isLoading ? (
          <span className="text-gray-400">...</span>
        ) : (
          formatCurrency(currentPrice)
        )}
      </td>
      <td className="px-4 py-3 text-right font-medium text-gray-900">
        {isLoading ? (
          <span className="text-gray-400">...</span>
        ) : (
          formatCurrency(marketValue)
        )}
      </td>
      <td className="px-4 py-3 text-right">
        {isLoading ? (
          <span className="text-gray-400">...</span>
        ) : (
          <div className={cn('font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
            <span>{isPositive ? '+' : ''}{formatCurrency(gainLoss)}</span>
            <span className="ml-1 text-sm">
              ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </td>
    </tr>
  );
}

/**
 * Mobile card for a position
 */
function PositionCard({
  position,
  onClick,
}: {
  position: Position;
  onClick?: () => void;
}) {
  const { quote, isLoading } = useStockQuote(position.symbol);

  // Calculate values
  const currentPrice = quote?.currentPrice ?? 0;
  const marketValue = position.shares * currentPrice;
  const gainLoss = marketValue - position.totalCost;
  const gainLossPercent = position.totalCost > 0 ? (gainLoss / position.totalCost) * 100 : 0;
  const isPositive = gainLoss >= 0;

  return (
    <Card
      className={cn(onClick && 'cursor-pointer')}
      hoverable={!!onClick}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{position.symbol}</h3>
          <p className="text-sm text-gray-500">{position.shares} shares</p>
        </div>
        <div className="text-right">
          {isLoading ? (
            <span className="text-gray-400">Loading...</span>
          ) : (
            <>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(marketValue)}
              </p>
              <p className={cn('text-sm font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
                {isPositive ? '+' : ''}{formatCurrency(gainLoss)} ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-sm">
        <div>
          <span className="text-gray-500">Avg Cost</span>
          <p className="font-medium text-gray-900">{formatCurrency(position.averageCost)}</p>
        </div>
        <div className="text-right">
          <span className="text-gray-500">Current Price</span>
          <p className="font-medium text-gray-900">
            {isLoading ? '...' : formatCurrency(currentPrice)}
          </p>
        </div>
      </div>
    </Card>
  );
}

/**
 * Portfolio summary component
 */
interface PortfolioSummaryProps {
  /** Map of symbol to current price */
  currentPrices?: Record<string, number>;
  /** Additional class names */
  className?: string;
}

export function PortfolioSummary({ currentPrices = {}, className }: PortfolioSummaryProps) {
  const t = useTranslations('trading');

  // Use useShallow to select multiple values without causing infinite re-renders.
  // Without useShallow, every render creates a new object reference, triggering another render.
  const { cash, calculatePortfolioValue, calculateTotalGainLoss } = useTradingStore(
    useShallow((state) => ({
      cash: state.cash,
      calculatePortfolioValue: state.calculatePortfolioValue,
      calculateTotalGainLoss: state.calculateTotalGainLoss,
    }))
  );

  // Use the cached positionsList selector (returns stable reference)
  const positionsList = useTradingStore(selectPositionsList);

  // Build prices map from current quotes
  const prices = useMemo(() => {
    const pricesMap = { ...currentPrices };
    // If we don't have prices passed in, we'll use 0 (user should pass prices)
    return pricesMap;
  }, [currentPrices]);

  // Calculate values
  const portfolioValue = calculatePortfolioValue(prices);
  const { amount: gainLoss, percent: gainLossPercent } = calculateTotalGainLoss(prices);
  const totalInvested = positionsList.reduce((sum, p) => sum + p.totalCost, 0);
  const isPositive = gainLoss >= 0;

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {/* Portfolio Value */}
      <Card>
        <p className="text-sm text-gray-500">{t('portfolioValue')}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {formatCurrency(portfolioValue)}
        </p>
      </Card>

      {/* Cash Balance */}
      <Card>
        <p className="text-sm text-gray-500">{t('cashBalance')}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {formatCurrency(cash)}
        </p>
      </Card>

      {/* Total Return */}
      <Card>
        <p className="text-sm text-gray-500">{t('totalReturn')}</p>
        <div className="mt-1">
          <p className={cn('text-2xl font-bold', isPositive ? 'text-green-600' : 'text-red-600')}>
            {isPositive ? '+' : ''}{formatCurrency(gainLoss)}
          </p>
          {totalInvested > 0 && (
            <p className={cn('text-sm', isPositive ? 'text-green-600' : 'text-red-600')}>
              {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
            </p>
          )}
        </div>
      </Card>

      {/* Holdings Count */}
      <Card>
        <p className="text-sm text-gray-500">{t('holdings')}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {positionsList.length}
        </p>
      </Card>
    </div>
  );
}
