/**
 * Trade Form Component
 *
 * Buy/sell form for executing paper trades.
 * Includes validation, estimated cost/proceeds, and confirmation.
 *
 * Features:
 * - Buy/Sell toggle with visual feedback
 * - Real-time price display from stock quote
 * - Input validation with error messages
 * - Estimated cost/proceeds calculation
 * - Confirmation modal before trade execution
 * - Success/error feedback messages
 *
 * Performance optimizations:
 * - Memoized event handlers with useCallback
 * - Memoized computed values with useMemo
 * - Memoized sub-components to prevent unnecessary re-renders
 * - useShallow for Zustand store selections to avoid infinite re-renders
 *
 * State management:
 * - Local state for form inputs and UI state
 * - Trading store (Zustand) for cash balance and positions
 * - SWR-based quote fetching for real-time prices
 *
 * ZUSTAND PATTERN: Uses useShallow for selecting multiple store values.
 * See PortfolioTable.tsx header comments for detailed explanation.
 */

'use client';

import { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useStockQuote } from '@/hooks/useStockQuote';
import { useTradingStore } from '@/stores/useTradingStore';
import { cn, formatCurrency } from '@/lib/utils';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/** Trade direction - either buying or selling shares */
type TradeType = 'buy' | 'sell';

interface TradeFormProps {
  /** Stock symbol to trade (e.g., "AAPL", "GOOGL") */
  symbol: string;
  /** Company name for display in confirmation modal */
  name?: string;
  /** Callback invoked after a successful trade execution */
  onTradeComplete?: () => void;
  /** Additional CSS class names for styling customization */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Duration (ms) to show success message before clearing */
const SUCCESS_MESSAGE_DURATION = 2000;

/** Default number of shares for new trades */
const DEFAULT_SHARES = 1;

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

/**
 * Trade type toggle button component.
 * Renders a styled button for switching between buy and sell modes.
 * Memoized to prevent re-renders when other form state changes.
 */
interface TradeTypeButtonProps {
  /** The trade type this button represents */
  type: TradeType;
  /** Currently selected trade type */
  currentType: TradeType;
  /** Click handler for selecting this trade type */
  onClick: () => void;
  /** Button label text */
  label: string;
}

const TradeTypeButton = memo(function TradeTypeButton({
  type,
  currentType,
  onClick,
  label,
}: TradeTypeButtonProps) {
  const isActive = type === currentType;
  const activeColor = type === 'buy' ? 'bg-green-600' : 'bg-red-600';

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
        isActive ? `${activeColor} text-white` : 'text-gray-600 hover:text-gray-900'
      )}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
});

/**
 * Price display row component.
 * Shows a label and value in a styled row format.
 * Memoized to prevent re-renders when parent state changes.
 */
interface PriceRowProps {
  /** Label text displayed on the left */
  label: string;
  /** Value text displayed on the right */
  value: string;
  /** Whether to use bold styling for the value */
  bold?: boolean;
  /** Text size class for the value */
  valueSize?: 'sm' | 'base' | 'lg';
}

const PriceRow = memo(function PriceRow({
  label,
  value,
  bold = false,
  valueSize = 'base',
}: PriceRowProps) {
  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span
        className={cn(
          sizeClasses[valueSize],
          bold ? 'font-bold' : 'font-medium',
          'text-gray-900'
        )}
      >
        {value}
      </span>
    </div>
  );
});

/**
 * Feedback message component for success/error states.
 * Displays a colored box with the appropriate message.
 * Memoized to prevent unnecessary re-renders.
 */
interface FeedbackMessageProps {
  /** Message text to display */
  message: string;
  /** Type of message determines color styling */
  type: 'success' | 'error';
}

const FeedbackMessage = memo(function FeedbackMessage({
  message,
  type,
}: FeedbackMessageProps) {
  const styles =
    type === 'success'
      ? 'bg-green-50 text-green-600'
      : 'bg-red-50 text-red-600';

  return (
    <div className={cn('rounded-lg p-3 text-sm', styles)} role="alert">
      {message}
    </div>
  );
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Trade form for buying and selling stocks in paper trading.
 *
 * This component provides a complete trading interface with:
 * - Toggle between buy and sell modes
 * - Real-time stock price display
 * - Share quantity input with validation
 * - Estimated cost/proceeds calculation
 * - Confirmation modal before execution
 * - Success/error feedback
 *
 * @example
 * // Basic usage
 * <TradeForm symbol="AAPL" name="Apple Inc." />
 *
 * @example
 * // With completion callback
 * <TradeForm
 *   symbol="AAPL"
 *   name="Apple Inc."
 *   onTradeComplete={() => setSelectedStock(null)}
 * />
 */
export function TradeForm({
  symbol,
  name,
  onTradeComplete,
  className,
}: TradeFormProps) {
  // ---------------------------------------------------------------------------
  // HOOKS & EXTERNAL STATE
  // ---------------------------------------------------------------------------

  // Translations for internationalization
  const t = useTranslations('trading.trade');

  // Fetch real-time quote data using SWR-based hook
  const { quote, isLoading: quoteLoading } = useStockQuote(symbol);

  // Get trading store values using useShallow to avoid infinite re-renders.
  // Functions (buy, sell, getPosition) are stable references, but we include them
  // in useShallow for consistency and to select multiple values at once.
  const { cash, buy, sell, getPosition } = useTradingStore(
    useShallow((state) => ({
      cash: state.cash,
      buy: state.buy,
      sell: state.sell,
      getPosition: state.getPosition,
    }))
  );

  // Get current position for this symbol
  const position = getPosition(symbol);

  // ---------------------------------------------------------------------------
  // LOCAL STATE
  // ---------------------------------------------------------------------------

  // Form input state
  const [tradeType, setTradeType] = useState<TradeType>('buy');
  const [shares, setShares] = useState<number>(DEFAULT_SHARES);

  // UI state
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Ref to store timeout ID for cleanup
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // CLEANUP EFFECT
  // Clear timeout on unmount to prevent memory leaks and state updates
  // on unmounted components
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // MEMOIZED COMPUTED VALUES
  // ---------------------------------------------------------------------------

  /**
   * Calculate the estimated total value of the trade.
   * Returns 0 if quote is unavailable or shares is invalid.
   */
  const estimatedValue = useMemo(() => {
    if (!quote || shares <= 0) {
      return 0;
    }
    return shares * quote.currentPrice;
  }, [quote, shares]);

  /**
   * Validate the trade and return an error message if invalid.
   * Returns null if the trade is valid.
   *
   * Validation rules:
   * - Buy: Must have sufficient cash balance
   * - Sell: Must own the stock and have enough shares
   */
  const validationError = useMemo(() => {
    // Don't show error for empty or zero input
    if (shares <= 0) {
      return null;
    }

    if (tradeType === 'buy') {
      // Check if user has enough cash to buy
      if (estimatedValue > cash) {
        return t('insufficientFunds');
      }
    } else {
      // Check if user owns the stock
      if (!position) {
        return `You don't own any shares of ${symbol}`;
      }
      // Check if user has enough shares to sell
      if (shares > position.shares) {
        return t('insufficientShares');
      }
    }

    return null;
  }, [tradeType, shares, estimatedValue, cash, position, symbol, t]);

  /**
   * Determine if the form can be submitted.
   * All conditions must be met for submission to be enabled.
   */
  const canSubmit = useMemo(() => {
    return Boolean(
      quote && // Must have quote data
        shares > 0 && // Must have positive share count
        !validationError && // Must pass validation
        !quoteLoading // Must not be loading quote
    );
  }, [quote, shares, validationError, quoteLoading]);

  /**
   * Get the maximum number of shares for the input.
   * For sell orders, limits to owned shares.
   */
  const maxShares = useMemo(() => {
    if (tradeType === 'sell' && position) {
      return position.shares;
    }
    return undefined;
  }, [tradeType, position]);

  /**
   * Format the current price for display.
   * Returns '--' placeholder if quote is not available.
   */
  const formattedPrice = useMemo(() => {
    return quote ? formatCurrency(quote.currentPrice) : '--';
  }, [quote]);

  // ---------------------------------------------------------------------------
  // MEMOIZED EVENT HANDLERS
  // Using useCallback to prevent unnecessary re-renders of child components
  // ---------------------------------------------------------------------------

  /**
   * Handle trade type toggle to buy mode.
   * Clears any previous errors when switching modes.
   */
  const handleSelectBuy = useCallback(() => {
    setTradeType('buy');
    setError(null);
  }, []);

  /**
   * Handle trade type toggle to sell mode.
   * Clears any previous errors when switching modes.
   */
  const handleSelectSell = useCallback(() => {
    setTradeType('sell');
    setError(null);
  }, []);

  /**
   * Handle share count changes from the number input.
   * Ensures the value is always a whole number (no fractional shares).
   * Clears errors when user modifies input.
   */
  const handleSharesChange = useCallback((val: number) => {
    setShares(Math.floor(val));
    setError(null);
  }, []);

  /**
   * Handle form submission - shows confirmation modal if valid.
   * Prevents default form submission behavior.
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (canSubmit) {
        setShowConfirm(true);
      }
    },
    [canSubmit]
  );

  /**
   * Handle closing the confirmation modal.
   * Used by both the cancel button and modal close button.
   */
  const handleCloseConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  /**
   * Execute the trade after user confirmation.
   * Handles both buy and sell operations with comprehensive error handling.
   *
   * Flow:
   * 1. Set submitting state
   * 2. Execute trade via store action
   * 3. Handle result (success or error)
   * 4. Clear state and close modal
   */
  const executeTrade = useCallback(async () => {
    // Validate required data before proceeding
    if (!quote || shares <= 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Execute the appropriate trade action from the store
      // Store returns error message string on failure, undefined on success
      const result =
        tradeType === 'buy'
          ? buy(symbol, shares, quote.currentPrice)
          : sell(symbol, shares, quote.currentPrice);

      if (result) {
        // Store returned an error message
        setError(result);
      } else {
        // Trade executed successfully
        setSuccessMessage(t('success'));
        setShares(DEFAULT_SHARES);

        // Clear success message and invoke callback after delay
        // Store timeout ref for cleanup on unmount
        successTimeoutRef.current = setTimeout(() => {
          setSuccessMessage(null);
          onTradeComplete?.();
        }, SUCCESS_MESSAGE_DURATION);
      }
    } catch (err) {
      // Handle unexpected errors (network issues, etc.)
      setError(err instanceof Error ? err.message : 'Trade failed');
    } finally {
      // Always reset submission state and close modal
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  }, [quote, shares, tradeType, buy, sell, symbol, t, onTradeComplete]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* Main trade form card */}
      <Card className={className}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================================================================= */}
          {/* TRADE TYPE TOGGLE                                                 */}
          {/* Buy/Sell buttons with visual indication of selected state         */}
          {/* ================================================================= */}
          <div className="flex rounded-lg bg-gray-100 p-1" role="group" aria-label="Trade type">
            <TradeTypeButton
              type="buy"
              currentType={tradeType}
              onClick={handleSelectBuy}
              label={t('buy')}
            />
            <TradeTypeButton
              type="sell"
              currentType={tradeType}
              onClick={handleSelectSell}
              label={t('sell')}
            />
          </div>

          {/* ================================================================= */}
          {/* CURRENT PRICE DISPLAY                                             */}
          {/* Shows real-time stock price from quote data                       */}
          {/* ================================================================= */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-sm text-gray-600">{t('currentPrice')}</span>
            <span className="font-semibold text-gray-900">{formattedPrice}</span>
          </div>

          {/* ================================================================= */}
          {/* SHARES INPUT                                                      */}
          {/* Number input with validation and max limit for sell orders        */}
          {/* ================================================================= */}
          <NumberInput
            label={t('shares')}
            value={shares}
            onChange={handleSharesChange}
            min={1}
            max={maxShares}
            decimals={0}
            error={validationError ?? undefined}
          />

          {/* ================================================================= */}
          {/* AVAILABLE BALANCE / SHARES                                        */}
          {/* Shows cash for buy orders, owned shares for sell orders           */}
          {/* ================================================================= */}
          <div className="text-sm text-gray-500">
            {tradeType === 'buy' ? (
              <span>
                Available cash:{' '}
                <span className="font-medium">{formatCurrency(cash)}</span>
              </span>
            ) : (
              <span>
                Shares owned:{' '}
                <span className="font-medium">{position?.shares ?? 0}</span>
              </span>
            )}
          </div>

          {/* ================================================================= */}
          {/* ESTIMATED COST/PROCEEDS                                           */}
          {/* Shows calculated total value of the trade                         */}
          {/* Only displayed when shares > 0 and quote is available             */}
          {/* ================================================================= */}
          {shares > 0 && quote && (
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {tradeType === 'buy' ? t('estimatedCost') : t('estimatedProceeds')}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(estimatedValue)}
                </span>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* FEEDBACK MESSAGES                                                 */}
          {/* Error and success messages with appropriate styling               */}
          {/* ================================================================= */}
          {error && <FeedbackMessage message={error} type="error" />}
          {successMessage && <FeedbackMessage message={successMessage} type="success" />}

          {/* ================================================================= */}
          {/* SUBMIT BUTTON                                                     */}
          {/* Disabled until form is valid, shows loading state during quote    */}
          {/* fetch. Color changes based on trade type (green/red)              */}
          {/* ================================================================= */}
          <Button
            type="submit"
            variant={tradeType === 'buy' ? 'success' : 'danger'}
            fullWidth
            disabled={!canSubmit}
            isLoading={quoteLoading}
          >
            {tradeType === 'buy' ? t('confirmBuy') : t('confirmSell')}
          </Button>
        </form>
      </Card>

      {/* ===================================================================== */}
      {/* CONFIRMATION MODAL                                                    */}
      {/* Shows trade details and requires user confirmation before execution   */}
      {/* ===================================================================== */}
      <Modal
        isOpen={showConfirm}
        onClose={handleCloseConfirm}
        title={tradeType === 'buy' ? t('confirmBuy') : t('confirmSell')}
        size="sm"
      >
        <div className="space-y-4">
          {/* Trade summary text */}
          <p className="text-gray-600">
            {tradeType === 'buy' ? 'Buy' : 'Sell'}{' '}
            <span className="font-semibold">{shares}</span> shares of{' '}
            <span className="font-semibold">{symbol}</span>
            {name && ` (${name})`}?
          </p>

          {/* Price breakdown showing per-share and total */}
          <div className="space-y-2 rounded-lg bg-gray-50 p-3">
            <PriceRow
              label="Price per share"
              value={formattedPrice}
              valueSize="sm"
            />
            <PriceRow
              label={tradeType === 'buy' ? 'Total cost' : 'Total proceeds'}
              value={formatCurrency(estimatedValue)}
              bold
              valueSize="lg"
            />
          </div>

          {/* Action buttons - Cancel and Confirm */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCloseConfirm}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant={tradeType === 'buy' ? 'success' : 'danger'}
              fullWidth
              onClick={executeTrade}
              isLoading={isSubmitting}
            >
              {tradeType === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
