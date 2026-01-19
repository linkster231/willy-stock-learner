/**
 * Button Component
 *
 * A reusable button with multiple variants and sizes.
 * Supports loading states and icon positioning.
 */

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Button variants define the visual style
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

// Button sizes with consistent touch targets
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading spinner and disable button */
  isLoading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Reusable button component with consistent styling.
 *
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * @example
 * <Button variant="secondary" isLoading={isSubmitting}>
 *   Save Changes
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles applied to all buttons
    const baseStyles = cn(
      'inline-flex items-center justify-center',
      'rounded-lg font-medium',
      'transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    );

    // Variant-specific styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary: cn(
        'bg-blue-600 text-white',
        'hover:bg-blue-700 active:bg-blue-800',
        'focus-visible:ring-blue-500'
      ),
      secondary: cn(
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200 active:bg-gray-300',
        'focus-visible:ring-gray-500'
      ),
      ghost: cn(
        'bg-transparent text-gray-700',
        'hover:bg-gray-100 active:bg-gray-200',
        'focus-visible:ring-gray-500'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-700 active:bg-red-800',
        'focus-visible:ring-red-500'
      ),
      success: cn(
        'bg-green-600 text-white',
        'hover:bg-green-700 active:bg-green-800',
        'focus-visible:ring-green-500'
      ),
    };

    // Size-specific styles with minimum touch targets (48px for mobile)
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-base min-w-[48px]',
      lg: 'h-12 px-6 text-lg min-w-[48px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
