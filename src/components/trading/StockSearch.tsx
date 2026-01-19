/**
 * Stock Search Component
 *
 * A searchable dropdown component that allows users to find stocks by symbol
 * or company name. Features include:
 * - Debounced search input (300ms delay) to minimize API calls
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Click-outside detection to close dropdown
 * - Loading, error, and empty states
 * - Full accessibility support (ARIA attributes)
 */

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/Input';
import { useStockSearch, type SearchResult } from '@/hooks/useStockQuote';
import { cn } from '@/lib/utils';

// =============================================================================
// Types & Interfaces
// =============================================================================

interface StockSearchProps {
  /** Callback fired when a stock is selected from the dropdown */
  onSelect: (symbol: string, name: string) => void;
  /** Custom placeholder text (defaults to translation) */
  placeholder?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Minimum query length to trigger search (default: 1) */
  minQueryLength?: number;
}

// =============================================================================
// Constants
// =============================================================================

/** Default debounce delay for search input */
const DEFAULT_DEBOUNCE_MS = 300;

/** Minimum characters required to trigger a search */
const DEFAULT_MIN_QUERY_LENGTH = 1;

// =============================================================================
// Sub-components
// =============================================================================

/**
 * Search icon SVG component
 * Extracted for cleaner JSX and potential reuse
 */
function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

/**
 * Loading spinner component
 * Shown while search results are being fetched
 */
function LoadingSpinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
      role="status"
      aria-label="Loading"
    />
  );
}

// =============================================================================
// Custom Hooks
// =============================================================================

/**
 * Custom hook for debouncing a value
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value or delay changes before timeout completes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for detecting clicks outside a referenced element
 *
 * @param ref - React ref to the container element
 * @param onClickOutside - Callback fired when clicking outside
 */
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClickOutside: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click target is outside the referenced element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    // Use mousedown for earlier detection (before focus changes)
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Stock search component with debounced input and dropdown results
 *
 * @example
 * // Basic usage
 * <StockSearch onSelect={(symbol, name) => console.log(symbol, name)} />
 *
 * @example
 * // With custom placeholder
 * <StockSearch
 *   onSelect={handleSelect}
 *   placeholder="Search for a stock..."
 *   className="w-full max-w-md"
 * />
 */
export function StockSearch({
  onSelect,
  placeholder,
  className,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minQueryLength = DEFAULT_MIN_QUERY_LENGTH,
}: StockSearchProps) {
  // ---------------------------------------------------------------------------
  // Internationalization
  // ---------------------------------------------------------------------------
  const t = useTranslations('trading.trade');

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  /** Current input value (updates immediately on keystroke) */
  const [query, setQuery] = useState('');

  /** Whether the dropdown is visible */
  const [isOpen, setIsOpen] = useState(false);

  /** Index of the currently highlighted result for keyboard navigation */
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // ---------------------------------------------------------------------------
  // Refs
  // ---------------------------------------------------------------------------

  /** Reference to the container for click-outside detection */
  const containerRef = useRef<HTMLDivElement>(null);

  /** Reference to the input for programmatic focus/blur */
  const inputRef = useRef<HTMLInputElement>(null);

  // ---------------------------------------------------------------------------
  // Derived State & Data Fetching
  // ---------------------------------------------------------------------------

  /** Debounced query to reduce API calls while typing */
  const debouncedQuery = useDebounce(query, debounceMs);

  /** Fetch search results using the debounced query */
  const { results, isLoading, error } = useStockSearch(debouncedQuery);

  /** Check if the query meets minimum length requirements */
  const hasValidQuery = query.length >= minQueryLength;

  /** Check if we should show the "no results" message */
  const showNoResults = useMemo(() => {
    return (
      !isLoading &&
      !error &&
      results.length === 0 &&
      debouncedQuery.length >= minQueryLength
    );
  }, [isLoading, error, results.length, debouncedQuery.length, minQueryLength]);

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  /**
   * Open dropdown when results arrive and query is valid
   * This provides immediate feedback when search results become available
   */
  useEffect(() => {
    if (results.length > 0 && hasValidQuery) {
      setIsOpen(true);
    }
  }, [results.length, hasValidQuery]);

  /**
   * Reset highlighted index when results change
   * This prevents stale index references when the list updates
   */
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  /**
   * Close dropdown when clicking outside the component
   */
  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(containerRef, handleClickOutside);

  // ---------------------------------------------------------------------------
  // Event Handlers (memoized for performance)
  // ---------------------------------------------------------------------------

  /**
   * Handle stock selection from the dropdown
   * Clears the input, closes dropdown, and notifies parent
   */
  const handleSelect = useCallback(
    (result: SearchResult) => {
      onSelect(result.symbol, result.name);
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  /**
   * Handle input value changes
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  /**
   * Handle input focus - reopen dropdown if we have results
   */
  const handleInputFocus = useCallback(() => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  }, [results.length]);

  /**
   * Handle keyboard navigation within the dropdown
   * Supports: ArrowDown, ArrowUp, Enter, Escape
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Early return if dropdown is closed or empty
      if (!isOpen || results.length === 0) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          // Move highlight down (stop at last item)
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          // Move highlight up (stop at first item)
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;

        case 'Enter':
          // Select the highlighted item
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < results.length) {
            handleSelect(results[highlightedIndex]);
          }
          break;

        case 'Escape':
          // Close the dropdown
          e.preventDefault();
          setIsOpen(false);
          break;

        default:
          // Allow other keys to propagate normally
          break;
      }
    },
    [isOpen, results, highlightedIndex, handleSelect]
  );

  /**
   * Handle mouse hover on result items
   * Updates the highlighted index for visual feedback
   */
  const handleResultHover = useCallback((index: number) => {
    setHighlightedIndex(index);
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Search Input */}
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? t('searchStock')}
        autoComplete="off"
        // Accessibility attributes
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="stock-search-results"
        aria-autocomplete="list"
        // Icon addons
        leftAddon={<SearchIcon />}
        rightAddon={isLoading ? <LoadingSpinner /> : null}
      />

      {/* Dropdown Results Container */}
      {isOpen && (
        <div
          id="stock-search-results"
          role="listbox"
          aria-label="Stock search results"
          className={cn(
            'absolute z-50 mt-1 w-full',
            'rounded-lg border border-gray-200 bg-white shadow-lg',
            'max-h-64 overflow-y-auto'
          )}
        >
          {/* Error State */}
          {error && (
            <div
              className="p-3 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              {error.message}
            </div>
          )}

          {/* No Results State */}
          {showNoResults && (
            <div className="p-3 text-sm text-gray-500" role="status">
              No results found for &quot;{debouncedQuery}&quot;
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <ul className="py-1">
              {results.map((result, index) => (
                <li
                  key={result.symbol}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={cn(
                    'cursor-pointer px-3 py-2',
                    'transition-colors duration-150',
                    index === highlightedIndex
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-50'
                  )}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => handleResultHover(index)}
                >
                  <div className="flex items-center justify-between">
                    {/* Stock symbol and company name */}
                    <div>
                      <span className="font-semibold text-gray-900">
                        {result.symbol}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {result.name}
                      </span>
                    </div>
                    {/* Stock type indicator */}
                    <span className="text-xs text-gray-400">{result.type}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
