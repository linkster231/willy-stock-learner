/**
 * Quote Display Component
 *
 * Displays stock quote information with color coding for price changes.
 * Shows current price, daily change, and trading day stats.
 *
 * Features:
 * - Real-time quote data fetching via useStockQuote hook
 * - Loading skeleton for better UX during data fetching
 * - Error state handling with visual feedback
 * - Revalidation indicator for background updates
 * - Responsive grid layout for detailed stats
 *
 * Performance optimizations:
 * - Memoized computed values (price direction, colors)
 * - Memoized child component (QuoteStat) to prevent unnecessary re-renders
 * - Skeleton loading to prevent layout shifts
 */

'use client';

import { memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { useStockQuote, type QuoteData } from '@/hooks/useStockQuote';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent } from '@/lib/utils';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

interface QuoteDisplayProps {
  /** Stock symbol to display (e.g., "AAPL", "GOOGL") */
  symbol: string;
  /** Company name for display below symbol */
  name?: string;
  /** Additional CSS class names for styling customization */
  className?: string;
  /** Whether to show detailed stats (open, high, low, prev close) */
  showDetails?: boolean;
}

interface QuoteStatProps {
  /** Label text displayed above the value */
  label: string;
  /** Formatted value string to display */
  value: string;
}

interface CompactQuoteProps {
  /** Stock symbol for fetching quote data */
  symbol: string;
  /** Pre-fetched current price (skips API call if provided) */
  currentPrice?: number;
  /** Pre-fetched change amount */
  change?: number;
  /** Pre-fetched change percentage */
  changePercent?: number;
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Loading skeleton component for quote display.
 * Provides visual placeholder during data fetching to prevent layout shifts.
 */
const QuoteLoadingSkeleton = memo(function QuoteLoadingSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <div className="flex items-center justify-between">
        {/* Left side: Symbol and name placeholders */}
        <div>
          <div className="h-6 w-20 rounded bg-gray-200" />
          <div className="mt-1 h-4 w-32 rounded bg-gray-200" />
        </div>
        {/* Right side: Price and change placeholders */}
        <div className="text-right">
          <div className="h-8 w-24 rounded bg-gray-200" />
          <div className="mt-1 h-4 w-16 rounded bg-gray-200" />
        </div>
      </div>
    </Card>
  );
});

/**
 * Error state component for quote display.
 * Shows error icon and message in a red-themed card.
 */
const QuoteErrorState = memo(function QuoteErrorState({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <Card className={cn('border-red-200 bg-red-50', className)}>
      <div className="flex items-center gap-2 text-red-600">
        {/* Error icon (exclamation in circle) */}
        <svg
          className="h-5 w-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm">{message}</span>
      </div>
    </Card>
  );
});

/**
 * Reusable stat item for the detailed quote section.
 * Memoized to prevent re-renders when parent updates.
 */
const QuoteStat = memo(function QuoteStat({ label, value }: QuoteStatProps) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
});

/**
 * Arrow icon component for price change direction.
 * Renders up or down arrow based on isPositive prop.
 */
const ChangeArrowIcon = memo(function ChangeArrowIcon({
  isPositive,
  className,
}: {
  isPositive: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      {isPositive ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 15l7-7 7 7"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M19 9l-7 7-7-7"
        />
      )}
    </svg>
  );
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Displays stock quote with price and change information.
 *
 * This component fetches real-time quote data and displays:
 * - Stock symbol and company name
 * - Current price with formatted currency
 * - Price change (absolute and percentage) with color coding
 * - Optional detailed stats (open, high, low, previous close)
 *
 * @example
 * // Basic usage
 * <QuoteDisplay symbol="AAPL" name="Apple Inc." />
 *
 * @example
 * // Without detailed stats
 * <QuoteDisplay symbol="AAPL" showDetails={false} />
 */
export function QuoteDisplay({
  symbol,
  name,
  className,
  showDetails = true,
}: QuoteDisplayProps) {
  // Fetch translations for internationalization
  const t = useTranslations('trading.trade');

  // Fetch quote data using SWR-based hook
  // isValidating indicates background revalidation is in progress
  const { quote, isLoading, error, isValidating } = useStockQuote(symbol);

  // ---------------------------------------------------------------------------
  // MEMOIZED COMPUTED VALUES
  // Memoize price direction and colors to prevent recalculation on every render
  // ---------------------------------------------------------------------------

  const priceDirection = useMemo(() => {
    if (!quote) return null;

    const isPositive = quote.change >= 0;
    return {
      isPositive,
      // Text color: green for gains, red for losses
      textColor: isPositive ? 'text-green-600' : 'text-red-600',
      // Background color for the change badge
      bgColor: isPositive ? 'bg-green-100' : 'bg-red-100',
      // Sign prefix for display
      sign: isPositive ? '+' : '',
    };
  }, [quote]);

  // Memoize formatted stat values to prevent recalculation
  const formattedStats = useMemo(() => {
    if (!quote) return null;
    return {
      open: formatCurrency(quote.open),
      high: formatCurrency(quote.high),
      low: formatCurrency(quote.low),
      previousClose: formatCurrency(quote.previousClose),
      currentPrice: formatCurrency(quote.currentPrice),
      change: formatCurrency(quote.change),
      changePercent: quote.changePercent.toFixed(2),
    };
  }, [quote]);

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STATE
  // Show skeleton while initial data is being fetched
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <QuoteLoadingSkeleton className={className} />;
  }

  // ---------------------------------------------------------------------------
  // RENDER: ERROR STATE
  // Show error message when quote fetch fails
  // ---------------------------------------------------------------------------

  if (error) {
    return <QuoteErrorState message={error.message} className={className} />;
  }

  // ---------------------------------------------------------------------------
  // RENDER: NO DATA STATE
  // Return null if no quote data is available (shouldn't happen normally)
  // ---------------------------------------------------------------------------

  if (!quote || !priceDirection || !formattedStats) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN QUOTE DISPLAY
  // ---------------------------------------------------------------------------

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {/* Revalidating indicator - shows when background update is in progress */}
      {isValidating && (
        <div className="absolute right-2 top-2" aria-label="Updating quote">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
        </div>
      )}

      {/* Main quote information section */}
      <div className="flex items-start justify-between">
        {/* Left side: Symbol and company name */}
        <div>
          <h3 className="text-xl font-bold text-gray-900">{symbol}</h3>
          {name && (
            <p className="text-sm text-gray-500 line-clamp-1">{name}</p>
          )}
        </div>

        {/* Right side: Current price and change */}
        <div className="text-right">
          {/* Current price - large and prominent */}
          <p className="text-2xl font-bold text-gray-900">
            {formattedStats.currentPrice}
          </p>

          {/* Change badge with arrow icon */}
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
              priceDirection.bgColor
            )}
          >
            <ChangeArrowIcon
              isPositive={priceDirection.isPositive}
              className={cn('h-3 w-3', priceDirection.textColor)}
            />
            <span className={cn('text-sm font-medium', priceDirection.textColor)}>
              {priceDirection.sign}
              {formattedStats.change} ({priceDirection.sign}
              {formattedStats.changePercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Detailed statistics section - optional */}
      {showDetails && (
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-4">
          <QuoteStat label="Open" value={formattedStats.open} />
          <QuoteStat label="High" value={formattedStats.high} />
          <QuoteStat label="Low" value={formattedStats.low} />
          <QuoteStat label="Prev Close" value={formattedStats.previousClose} />
        </div>
      )}
    </Card>
  );
}

// =============================================================================
// COMPACT QUOTE COMPONENT
// =============================================================================

/**
 * Internal component that fetches and displays quote data.
 * Separated to allow the hook to always be called (React rules of hooks).
 */
function CompactQuoteFetcher({ symbol }: { symbol: string }) {
  // Always fetch quote data - hook must be called unconditionally
  const { quote, isLoading, error } = useStockQuote(symbol);

  // Loading state - simple text indicator
  if (isLoading) {
    return <span className="text-sm text-gray-400">Loading...</span>;
  }

  // Error or no data state
  if (error || !quote) {
    return <span className="text-sm text-gray-400">--</span>;
  }

  // Calculate price direction and styling
  const isPositive = quote.change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-900">
        {formatCurrency(quote.currentPrice)}
      </span>
      <span className={cn('text-sm', changeColor)}>
        {isPositive ? '+' : ''}
        {quote.changePercent.toFixed(2)}%
      </span>
    </div>
  );
}

/**
 * Compact quote display optimized for lists and tables.
 *
 * Supports two modes:
 * 1. Pre-fetched data: If currentPrice is provided, displays it immediately
 *    without making an API call (better for lists with bulk data)
 * 2. Auto-fetch: If no price provided, fetches quote data for the symbol
 *
 * @example
 * // With pre-fetched data (no API call)
 * <CompactQuote symbol="AAPL" currentPrice={150.50} change={2.5} changePercent={1.69} />
 *
 * @example
 * // Auto-fetch mode (makes API call)
 * <CompactQuote symbol="AAPL" />
 */
export const CompactQuote = memo(function CompactQuote({
  symbol,
  currentPrice,
  change,
  changePercent,
}: CompactQuoteProps) {
  // ---------------------------------------------------------------------------
  // PRE-FETCHED DATA MODE
  // If currentPrice is provided, render immediately without fetching
  // This is more efficient for lists where data is already available
  // ---------------------------------------------------------------------------

  if (currentPrice !== undefined) {
    const isPositive = (change ?? 0) >= 0;
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900">
          {formatCurrency(currentPrice)}
        </span>
        {change !== undefined && changePercent !== undefined && (
          <span className={cn('text-sm', changeColor)}>
            {isPositive ? '+' : ''}
            {changePercent.toFixed(2)}%
          </span>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTO-FETCH MODE
  // Use separate component to ensure hook is always called (React rules of hooks)
  // This pattern avoids conditional hook calls which would cause errors
  // ---------------------------------------------------------------------------

  return <CompactQuoteFetcher symbol={symbol} />;
});
