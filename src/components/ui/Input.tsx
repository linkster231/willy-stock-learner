/**
 * Input Component
 *
 * A styled input field with label, help text, and error states.
 * Supports all standard HTML input types.
 */

import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input */
  label?: string;
  /** Help text displayed below the input */
  helpText?: string;
  /** Error message - replaces help text when present */
  error?: string;
  /** Left icon/addon */
  leftAddon?: React.ReactNode;
  /** Right icon/addon */
  rightAddon?: React.ReactNode;
}

/**
 * Styled input field with optional label and error states.
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   error={errors.email}
 * />
 *
 * @example
 * <Input
 *   label="Amount"
 *   type="number"
 *   leftAddon="$"
 *   helpText="Enter the starting amount"
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, helpText, error, leftAddon, rightAddon, id, ...props },
    ref
  ) => {
    // useId() generates stable IDs that match between server and client rendering,
    // preventing hydration mismatch errors. Unlike Math.random(), useId() produces
    // the same ID on both server and client for the same component instance.
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasError = !!error;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        {/* Input wrapper for addons */}
        <div className="relative">
          {/* Left addon */}
          {leftAddon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftAddon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base styles
              'block w-full rounded-lg border bg-white',
              'text-gray-900 placeholder:text-gray-400',
              // Sizing (min height for touch targets)
              'h-11 px-4 text-base',
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Default border
              !hasError && 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
              // Error border
              hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              // Disabled state
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              // Addon padding adjustments
              leftAddon && 'pl-10',
              rightAddon && 'pr-10',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
            }
            {...props}
          />

          {/* Right addon */}
          {rightAddon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightAddon}
            </div>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Help text (only shown if no error) */}
        {helpText && !hasError && (
          <p id={`${inputId}-help`} className="mt-1.5 text-sm text-gray-500">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Number Input with formatting
 * Useful for currency and percentage inputs in calculators.
 */
interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange' | 'value'> {
  /** Current numeric value */
  value: number | '';
  /** Called when value changes - only called with valid numbers */
  onChange: (value: number) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Step amount for increment/decrement */
  step?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, min, max, decimals = 2, step, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      // For empty input, use min value or 0
      if (rawValue === '') {
        onChange(min ?? 0);
        return;
      }

      // Parse the number
      let numValue = parseFloat(rawValue);

      // Validate the number
      if (isNaN(numValue)) return;

      // Apply min/max constraints
      if (min !== undefined && numValue < min) numValue = min;
      if (max !== undefined && numValue > max) numValue = max;

      // Round to specified decimals
      const factor = Math.pow(10, decimals);
      numValue = Math.round(numValue * factor) / factor;

      onChange(numValue);
    };

    // Calculate step value - use provided step or derive from decimals
    const stepValue = step ?? Math.pow(10, -decimals);

    return (
      <Input
        ref={ref}
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={stepValue}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';
