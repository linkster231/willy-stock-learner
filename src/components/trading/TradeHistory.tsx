/**
 * Trade History Component
 *
 * Displays a chronological list of all executed trades from the trading store.
 * Features:
 * - Responsive design: table view on desktop, card view on mobile
 * - Configurable sorting (newest/oldest first)
 * - Optional limit for displaying a subset of trades
 * - Memoized sorting/filtering for performance with large trade lists
 * - Graceful handling of empty state
 *
 * @module components/trading/TradeHistory
 */

'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { useTradingStore, selectTrades, type Trade } from '@/stores/useTradingStore';
import { cn, formatCurrency } from '@/lib/utils';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

/** Available sort order options */
type SortOrder = 'newest' | 'oldest';

/** Props for the TradeHistory component */
interface TradeHistoryProps {
  /** Maximum number of trades to display. Set to 0 or omit to show all trades. */
  limit?: number;
  /** Additional CSS class names to apply to the container */
  className?: string;
}

/** Props for individual trade display components */
interface TradeItemProps {
  /** The trade data to display */
  trade: Trade;
}

// ============================================================================
// DATE FORMATTING UTILITIES
// ============================================================================

/**
 * Cached Intl.DateTimeFormat instances for performance.
 * Creating DateTimeFormat is expensive, so we reuse instances.
 */
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const dateShortFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: '2-digit',
});

/**
 * Formats a Unix timestamp into a full date/time string for desktop display.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string like "Jan 15, 2024, 2:30 PM"
 *
 * @example
 * formatDateTime(1705329000000) // "Jan 15, 2024, 2:30 PM"
 */
function formatDateTime(timestamp: number): string {
  return dateTimeFormatter.format(new Date(timestamp));
}

/**
 * Formats a Unix timestamp into a short date string for mobile display.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string like "Jan 15, '24"
 *
 * @example
 * formatDateShort(1705329000000) // "Jan 15, '24"
 */
function formatDateShort(timestamp: number): string {
  return dateShortFormatter.format(new Date(timestamp));
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Trade history display with responsive layout and sorting controls.
 *
 * Renders a sorted list of trades with:
 * - Desktop: Full table with all trade details
 * - Mobile: Compact card layout optimized for small screens
 *
 * Performance considerations:
 * - Sorting and slicing are memoized to avoid recalculation on every render
 * - Child components (TradeRow, TradeCard) are memoized to prevent unnecessary re-renders
 * - Sort order change handler is memoized with useCallback
 *
 * @param props - Component props
 * @param props.limit - Maximum trades to show (0 = unlimited)
 * @param props.className - Additional CSS classes
 *
 * @example
 * // Show all trades
 * <TradeHistory />
 *
 * @example
 * // Show only the 5 most recent trades
 * <TradeHistory limit={5} />
 *
 * @example
 * // With custom styling
 * <TradeHistory className="mt-4" limit={10} />
 */
export function TradeHistory({ limit = 0, className }: TradeHistoryProps) {
  const t = useTranslations('trading');

  // Subscribe to trades from the store using a selector for optimal re-renders
  const trades = useTradingStore(selectTrades);

  // Track current sort order (defaults to newest first)
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  /**
   * Memoized handler for sort order changes.
   * Wrapped in useCallback to maintain referential equality for the select element.
   */
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOrder(e.target.value as SortOrder);
    },
    []
  );

  /**
   * Memoized sorted and limited trade list.
   *
   * Performance: Only recalculates when trades array, sort order, or limit changes.
   * For large trade lists (1000+ trades), this prevents expensive re-sorting on
   * unrelated state changes.
   *
   * Note: The store prepends new trades (newest at index 0), but we still sort
   * explicitly to ensure correct ordering regardless of store implementation.
   */
  const displayedTrades = useMemo(() => {
    // Early return for empty array - no need to sort
    if (trades.length === 0) {
      return [];
    }

    // Sort trades by timestamp
    const sorted = [...trades].sort((a, b) => {
      return sortOrder === 'newest'
        ? b.timestamp - a.timestamp // Descending (newest first)
        : a.timestamp - b.timestamp; // Ascending (oldest first)
    });

    // Apply limit if specified (limit > 0)
    return limit > 0 ? sorted.slice(0, limit) : sorted;
  }, [trades, sortOrder, limit]);

  // ----------------------------------------------------------------------------
  // Empty State
  // ----------------------------------------------------------------------------

  if (trades.length === 0) {
    return (
      <Card className={cn('text-center py-8', className)}>
        <div className="text-gray-400">
          {/* Clipboard icon indicating empty history */}
          <svg
            className="mx-auto h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-sm">{t('history.noTransactions')}</p>
        </div>
      </Card>
    );
  }

  // ----------------------------------------------------------------------------
  // Main Render
  // ----------------------------------------------------------------------------

  return (
    <div className={className}>
      {/* Header with Title and Sort Controls */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('history.title')}
        </h3>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label={t('history.sortBy')}
        >
          <option value="newest">{t('history.newestFirst')}</option>
          <option value="oldest">{t('history.oldestFirst')}</option>
        </select>
      </div>

      {/* Desktop Table View - Hidden on mobile (< md breakpoint) */}
      <div className="hidden md:block">
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('history.date')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('history.symbol')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('history.action')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('history.shares')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('history.price')}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t('history.total')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedTrades.map((trade) => (
                  <TradeRow key={trade.id} trade={trade} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View - Visible only on mobile (< md breakpoint) */}
      <div className="space-y-3 md:hidden">
        {displayedTrades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Desktop table row for displaying a single trade.
 *
 * Memoized to prevent unnecessary re-renders when other trades in the list change.
 * Only re-renders when the trade prop changes (which won't happen since trades
 * are immutable once created).
 *
 * Visual indicators:
 * - Buy trades: Green badge, negative total (money spent)
 * - Sell trades: Red badge, positive total (money received)
 *
 * @param props - Component props
 * @param props.trade - The trade data to display
 */
const TradeRow = memo(function TradeRow({ trade }: TradeItemProps) {
  const t = useTranslations('trading');

  // Determine if this is a buy or sell for styling
  const isBuy = trade.type === 'buy';

  return (
    <tr className="transition-colors hover:bg-gray-50">
      {/* Date & Time */}
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDateTime(trade.timestamp)}
      </td>

      {/* Stock Symbol */}
      <td className="px-4 py-3">
        <span className="font-semibold text-gray-900">{trade.symbol}</span>
      </td>

      {/* Action Badge (Buy/Sell) */}
      <td className="px-4 py-3">
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            isBuy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          )}
        >
          {isBuy ? t('history.bought') : t('history.sold')}
        </span>
      </td>

      {/* Number of Shares */}
      <td className="px-4 py-3 text-right text-gray-900">{trade.shares}</td>

      {/* Price Per Share */}
      <td className="px-4 py-3 text-right text-gray-600">
        {formatCurrency(trade.pricePerShare)}
      </td>

      {/* Total Value (negative for buys, positive for sells) */}
      <td
        className={cn(
          'px-4 py-3 text-right font-medium',
          isBuy ? 'text-green-600' : 'text-red-600'
        )}
      >
        {isBuy ? '-' : '+'}
        {formatCurrency(trade.totalValue)}
      </td>
    </tr>
  );
});

/**
 * Mobile card for displaying a single trade.
 *
 * Memoized for performance - prevents re-renders when parent component
 * updates but the trade data hasn't changed.
 *
 * Layout:
 * - Header: Symbol, action badge, and short date
 * - Details: Three-column grid with shares, price, and total
 *
 * @param props - Component props
 * @param props.trade - The trade data to display
 */
const TradeCard = memo(function TradeCard({ trade }: TradeItemProps) {
  const t = useTranslations('trading');

  // Determine if this is a buy or sell for styling
  const isBuy = trade.type === 'buy';

  return (
    <Card>
      {/* Header Row: Symbol, Badge, Date */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* Stock Symbol */}
          <span className="text-lg font-bold text-gray-900">{trade.symbol}</span>

          {/* Action Badge */}
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              isBuy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}
          >
            {isBuy ? t('history.bought') : t('history.sold')}
          </span>
        </div>

        {/* Short Date (mobile-optimized) */}
        <span className="text-sm text-gray-500">
          {formatDateShort(trade.timestamp)}
        </span>
      </div>

      {/* Details Grid: Shares, Price, Total */}
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-sm">
        {/* Shares Column */}
        <div>
          <span className="text-gray-500">{t('history.shares')}</span>
          <p className="font-medium text-gray-900">{trade.shares}</p>
        </div>

        {/* Price Column */}
        <div>
          <span className="text-gray-500">{t('history.price')}</span>
          <p className="font-medium text-gray-900">
            {formatCurrency(trade.pricePerShare)}
          </p>
        </div>

        {/* Total Column (right-aligned) */}
        <div className="text-right">
          <span className="text-gray-500">{t('history.total')}</span>
          <p
            className={cn('font-medium', isBuy ? 'text-green-600' : 'text-red-600')}
          >
            {isBuy ? '-' : '+'}
            {formatCurrency(trade.totalValue)}
          </p>
        </div>
      </div>
    </Card>
  );
});
