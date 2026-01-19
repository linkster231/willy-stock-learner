/**
 * Trading Store
 *
 * Zustand store for managing paper trading portfolio state.
 * Persists to localStorage for offline use.
 *
 * IMPORTANT: Zustand SSR/Hydration Notes
 * =====================================
 * When using Zustand with SSR (Next.js App Router), you must be careful about
 * selectors that create new references (arrays/objects) on every call.
 *
 * The error "The result of getServerSnapshot should be cached" occurs when:
 * 1. A selector returns a new array/object reference on every call
 * 2. React's useSyncExternalStore detects the reference changed
 * 3. This triggers a re-render, which calls the selector again
 * 4. Infinite loop!
 *
 * Solutions used in this file:
 * 1. Cache derived arrays (like positionsList) in the store state itself
 * 2. Update the cache only when the source data changes
 * 3. Use primitive selectors where possible (they compare by value)
 * 4. For multiple values, use useShallow() from 'zustand/react/shallow'
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Initial cash balance
const INITIAL_CASH = 100_000;

// Maximum number of portfolio resets allowed
const MAX_RESETS = 3;

// Maximum trades to keep in history (prevents unbounded growth)
const MAX_TRADES = 1000;

// Maximum reset requests to keep
const MAX_RESET_REQUESTS = 10;

/**
 * Position in the portfolio
 */
export interface Position {
  /** Stock symbol */
  symbol: string;
  /** Number of shares owned */
  shares: number;
  /** Average cost per share */
  averageCost: number;
  /** Total cost basis */
  totalCost: number;
}

/**
 * Trade record
 */
export interface Trade {
  /** Unique trade ID */
  id: string;
  /** Stock symbol */
  symbol: string;
  /** Trade type: buy or sell */
  type: 'buy' | 'sell';
  /** Number of shares */
  shares: number;
  /** Price per share at execution */
  pricePerShare: number;
  /** Total value of the trade */
  totalValue: number;
  /** Timestamp of the trade */
  timestamp: number;
}

/**
 * Reset request record (for admin review)
 */
export interface ResetRequest {
  /** Unique request ID */
  id: string;
  /** Timestamp when the request was made */
  requestedAt: number;
  /** Optional reason provided by user */
  reason?: string;
  /** Request status */
  status: 'pending' | 'approved' | 'denied';
}

/**
 * Trading state
 */
export interface TradingState {
  /** Available cash balance */
  cash: number;
  /** Current positions as a map (for fast lookup) */
  positions: Record<string, Position>;
  /**
   * Cached array of positions (derived from positions map).
   * This is cached to avoid creating new array references on every selector call,
   * which would cause infinite re-renders with SSR/useSyncExternalStore.
   */
  positionsList: Position[];
  /** Trade history */
  trades: Trade[];
  /** Last update timestamp */
  lastUpdated: number;

  // ===== RESET LIMIT TRACKING =====
  /** Number of times the portfolio has been reset */
  resetCount: number;
  /** Maximum resets allowed (constant) */
  maxResets: number;
  /** Timestamp of the last reset (null if never reset) */
  lastResetAt: number | null;
  /** List of additional reset requests (for admin review) */
  resetRequests: ResetRequest[];
}

/**
 * Trading actions
 */
export interface TradingActions {
  /**
   * Execute a buy order
   * @param symbol - Stock symbol
   * @param shares - Number of shares to buy
   * @param pricePerShare - Current price per share
   * @returns Error message if failed, undefined if successful
   */
  buy: (symbol: string, shares: number, pricePerShare: number) => string | undefined;

  /**
   * Execute a sell order
   * @param symbol - Stock symbol
   * @param shares - Number of shares to sell
   * @param pricePerShare - Current price per share
   * @returns Error message if failed, undefined if successful
   */
  sell: (symbol: string, shares: number, pricePerShare: number) => string | undefined;

  /**
   * Reset portfolio to initial state
   * @returns true if reset was successful, false if no resets remaining
   */
  resetPortfolio: () => boolean;

  /**
   * Check if user can still reset their portfolio
   */
  canReset: () => boolean;

  /**
   * Get the number of remaining resets
   */
  getRemainingResets: () => number;

  /**
   * Request an additional reset (logged for admin review)
   * @param reason - Optional reason for the request
   */
  requestAdditionalReset: (reason?: string) => void;

  /**
   * Get position for a symbol
   */
  getPosition: (symbol: string) => Position | undefined;

  /**
   * Calculate total portfolio value
   * @param currentPrices - Map of symbol to current price
   */
  calculatePortfolioValue: (currentPrices: Record<string, number>) => number;

  /**
   * Calculate total gain/loss
   * @param currentPrices - Map of symbol to current price
   */
  calculateTotalGainLoss: (
    currentPrices: Record<string, number>
  ) => { amount: number; percent: number };
}

/**
 * Generate unique trade ID
 */
function generateTradeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Initial state
 */
const initialState: TradingState = {
  cash: INITIAL_CASH,
  positions: {},
  positionsList: [], // Cached array - always in sync with positions map
  trades: [],
  lastUpdated: Date.now(),
  // Reset limit tracking
  resetCount: 0,
  maxResets: MAX_RESETS,
  lastResetAt: null,
  resetRequests: [],
};

/**
 * Trading store with persistence
 */
export const useTradingStore = create<TradingState & TradingActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      buy: (symbol: string, shares: number, pricePerShare: number) => {
        const upperSymbol = symbol.toUpperCase();
        const totalCost = shares * pricePerShare;
        const state = get();

        // Validate
        if (shares <= 0) {
          return 'Number of shares must be positive';
        }

        if (pricePerShare <= 0) {
          return 'Price must be positive';
        }

        if (totalCost > state.cash) {
          return 'Insufficient funds';
        }

        // Create trade record
        const trade: Trade = {
          id: generateTradeId(),
          symbol: upperSymbol,
          type: 'buy',
          shares,
          pricePerShare,
          totalValue: totalCost,
          timestamp: Date.now(),
        };

        // Update state
        set((prevState) => {
          const existingPosition = prevState.positions[upperSymbol];
          const newPosition: Position = existingPosition
            ? {
                symbol: upperSymbol,
                shares: existingPosition.shares + shares,
                totalCost: existingPosition.totalCost + totalCost,
                averageCost:
                  (existingPosition.totalCost + totalCost) /
                  (existingPosition.shares + shares),
              }
            : {
                symbol: upperSymbol,
                shares,
                totalCost,
                averageCost: pricePerShare,
              };

          const newPositions = {
            ...prevState.positions,
            [upperSymbol]: newPosition,
          };

          const newTrades = [trade, ...prevState.trades];
          if (newTrades.length > MAX_TRADES) {
            newTrades.length = MAX_TRADES;
          }

          return {
            cash: prevState.cash - totalCost,
            positions: newPositions,
            positionsList: Object.values(newPositions),
            trades: newTrades,
            lastUpdated: Date.now(),
          };
        });

        return undefined; // Success
      },

      sell: (symbol: string, shares: number, pricePerShare: number) => {
        const upperSymbol = symbol.toUpperCase();
        const state = get();
        const position = state.positions[upperSymbol];

        // Validate
        if (shares <= 0) {
          return 'Number of shares must be positive';
        }

        if (pricePerShare <= 0) {
          return 'Price must be positive';
        }

        if (!position) {
          return `You don't own any shares of ${upperSymbol}`;
        }

        if (shares > position.shares) {
          return `You don't own enough shares (have ${position.shares})`;
        }

        const totalProceeds = shares * pricePerShare;

        // Create trade record
        const trade: Trade = {
          id: generateTradeId(),
          symbol: upperSymbol,
          type: 'sell',
          shares,
          pricePerShare,
          totalValue: totalProceeds,
          timestamp: Date.now(),
        };

        // Update state
        set((prevState) => {
          const existingPosition = prevState.positions[upperSymbol]!;
          const remainingShares = existingPosition.shares - shares;

          // Calculate new positions
          const newPositions = { ...prevState.positions };

          if (remainingShares === 0) {
            // Remove position entirely
            delete newPositions[upperSymbol];
          } else {
            // Update position with remaining shares
            // Keep the same average cost
            newPositions[upperSymbol] = {
              symbol: upperSymbol,
              shares: remainingShares,
              totalCost: existingPosition.averageCost * remainingShares,
              averageCost: existingPosition.averageCost,
            };
          }

          const newTrades = [trade, ...prevState.trades];
          if (newTrades.length > MAX_TRADES) {
            newTrades.length = MAX_TRADES;
          }

          return {
            cash: prevState.cash + totalProceeds,
            positions: newPositions,
            positionsList: Object.values(newPositions),
            trades: newTrades,
            lastUpdated: Date.now(),
          };
        });

        return undefined; // Success
      },

      resetPortfolio: () => {
        const state = get();

        // Check if user has resets remaining
        if (state.resetCount >= state.maxResets) {
          return false; // No resets remaining
        }

        set({
          // Reset trading state to initial values
          cash: INITIAL_CASH,
          positions: {},
          positionsList: [],
          trades: [],
          lastUpdated: Date.now(),
          // Increment reset count and track when it happened
          resetCount: state.resetCount + 1,
          lastResetAt: Date.now(),
          // Keep maxResets and resetRequests unchanged
          maxResets: state.maxResets,
          resetRequests: state.resetRequests,
        });

        return true; // Reset successful
      },

      canReset: () => {
        const state = get();
        return state.resetCount < state.maxResets;
      },

      getRemainingResets: () => {
        const state = get();
        return Math.max(0, state.maxResets - state.resetCount);
      },

      requestAdditionalReset: (reason?: string) => {
        const request: ResetRequest = {
          id: `reset-req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          requestedAt: Date.now(),
          reason,
          status: 'pending',
        };

        set((state) => {
          const newRequests = [...state.resetRequests, request];
          if (newRequests.length > MAX_RESET_REQUESTS) {
            newRequests.shift();
          }
          return { resetRequests: newRequests };
        });
      },

      getPosition: (symbol: string) => {
        return get().positions[symbol.toUpperCase()];
      },

      calculatePortfolioValue: (currentPrices: Record<string, number>) => {
        const state = get();
        let marketValue = 0;

        Object.values(state.positions).forEach((position) => {
          const currentPrice = currentPrices[position.symbol];
          if (currentPrice) {
            marketValue += position.shares * currentPrice;
          }
        });

        return state.cash + marketValue;
      },

      calculateTotalGainLoss: (currentPrices: Record<string, number>) => {
        const state = get();
        let totalCost = 0;
        let currentValue = 0;

        Object.values(state.positions).forEach((position) => {
          totalCost += position.totalCost;
          const currentPrice = currentPrices[position.symbol];
          if (currentPrice) {
            currentValue += position.shares * currentPrice;
          }
        });

        const gainLoss = currentValue - totalCost;
        const percent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

        return { amount: gainLoss, percent };
      },
    }),
    {
      name: 'willy-trading-store',
      storage: createJSONStorage(() => {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        cash: state.cash,
        positions: state.positions,
        positionsList: state.positionsList,
        trades: state.trades,
        lastUpdated: state.lastUpdated,
        // Also persist reset tracking
        resetCount: state.resetCount,
        maxResets: state.maxResets,
        lastResetAt: state.lastResetAt,
        resetRequests: state.resetRequests,
      }),
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================
//
// IMPORTANT: Selector Best Practices for Zustand with SSR
// -------------------------------------------------------
// 1. NEVER create new arrays/objects in selectors (causes infinite loops)
//    BAD:  (state) => Object.values(state.positions)  // Creates new array!
//    GOOD: (state) => state.positionsList              // Returns cached array
//
// 2. Use primitive selectors when possible (strings, numbers, booleans)
//    These compare by value, so no reference issues.
//
// 3. For selecting multiple values, use useShallow() in the component:
//    const { cash, trades } = useTradingStore(
//      useShallow((state) => ({ cash: state.cash, trades: state.trades }))
//    );
//
// 4. If you must derive data, cache it in the store state and update it
//    whenever the source data changes (like we do with positionsList).
// =============================================================================

/**
 * Select cash balance (primitive - safe for direct use)
 */
export const selectCash = (state: TradingState) => state.cash;

/**
 * Select positions map (object reference - use with caution)
 * Consider using selectPositionsList for iteration.
 */
export const selectPositions = (state: TradingState) => state.positions;

/**
 * Select trades array (reference - but stable unless trades change)
 */
export const selectTrades = (state: TradingState) => state.trades;

/**
 * Select positions as an array (CACHED - safe for direct use)
 *
 * This returns the cached positionsList from state, NOT a new array.
 * The cache is updated whenever positions change (in buy/sell actions).
 *
 * This pattern avoids the infinite loop caused by:
 *   (state) => Object.values(state.positions)  // BAD - creates new array each call!
 */
export const selectPositionsList = (state: TradingState) => state.positionsList;

/**
 * Select the number of positions (primitive - safe for direct use)
 */
export const selectPositionsCount = (state: TradingState) => state.positionsList.length;

/**
 * Select reset count (primitive - safe for direct use)
 */
export const selectResetCount = (state: TradingState) => state.resetCount;

/**
 * Select max resets (primitive - safe for direct use)
 */
export const selectMaxResets = (state: TradingState) => state.maxResets;

/**
 * Select remaining resets (primitive - safe for direct use)
 */
export const selectRemainingResets = (state: TradingState) =>
  Math.max(0, state.maxResets - state.resetCount);

/**
 * Select reset requests (reference - but stable unless requests change)
 */
export const selectResetRequests = (state: TradingState) => state.resetRequests;
