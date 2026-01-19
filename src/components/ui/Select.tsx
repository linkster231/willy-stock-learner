/**
 * Select Component
 *
 * A styled dropdown select with label and error states.
 */

import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Label text displayed above the select */
  label?: string;
  /** Help text displayed below the select */
  helpText?: string;
  /** Error message */
  error?: string;
  /** Select options */
  options: SelectOption[];
  /** Placeholder option (disabled, shown when no value selected) */
  placeholder?: string;
}

/**
 * Styled select dropdown.
 *
 * @example
 * <Select
 *   label="Compounding Frequency"
 *   value={frequency}
 *   onChange={(e) => setFrequency(e.target.value)}
 *   options={[
 *     { value: '1', label: 'Annually' },
 *     { value: '12', label: 'Monthly' },
 *   ]}
 * />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helpText,
      error,
      options,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const hasError = !!error;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        {/* Select wrapper for custom arrow */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              // Base styles
              'block w-full appearance-none rounded-lg border bg-white',
              'text-gray-900',
              // Sizing
              'h-11 px-4 pr-10 text-base',
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Default border
              !hasError && 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
              // Error border
              hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              // Disabled
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helpText ? `${selectId}-help` : undefined
            }
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Options */}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Help text */}
        {helpText && !hasError && (
          <p id={`${selectId}-help`} className="mt-1.5 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
