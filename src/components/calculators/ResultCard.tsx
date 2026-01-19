/**
 * Result Card Component
 *
 * Displays a single calculation result with label and value.
 * Used to show formatted results in calculators.
 */

import { cn, formatCurrency, formatPercent, formatNumber } from '@/lib/utils';

type ValueFormat = 'currency' | 'percent' | 'number' | 'years' | 'shares';

interface ResultCardProps {
  /** Label describing the result */
  label: string;
  /** The calculated value */
  value: number;
  /** How to format the value */
  format?: ValueFormat;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether this is a positive/negative indicator */
  variant?: 'default' | 'positive' | 'negative';
  /** Additional className */
  className?: string;
}

/**
 * Format a value based on the specified format type.
 */
function formatValue(value: number, format: ValueFormat): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value / 100);
    case 'number':
      return formatNumber(value);
    case 'years':
      return `${formatNumber(value)} years`;
    case 'shares':
      return `${formatNumber(value)} shares`;
    default:
      return String(value);
  }
}

/**
 * Individual result card showing a single metric.
 */
export function ResultCard({
  label,
  value,
  format = 'currency',
  size = 'md',
  variant = 'default',
  className,
}: ResultCardProps) {
  const formattedValue = formatValue(value, format);

  // Determine variant based on value if not specified
  const actualVariant =
    variant === 'default' && (format === 'currency' || format === 'percent')
      ? value >= 0
        ? 'positive'
        : 'negative'
      : variant;

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        actualVariant === 'positive' && 'border-green-200 bg-green-50',
        actualVariant === 'negative' && 'border-red-200 bg-red-50',
        actualVariant === 'default' && 'border-gray-200 bg-gray-50',
        className
      )}
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div
        className={cn(
          'font-bold',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl',
          actualVariant === 'positive' && 'text-green-700',
          actualVariant === 'negative' && 'text-red-700',
          actualVariant === 'default' && 'text-gray-900'
        )}
      >
        {formattedValue}
      </div>
    </div>
  );
}

/**
 * Grid of result cards for displaying multiple results.
 */
interface ResultGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function ResultGrid({
  children,
  columns = 2,
  className,
}: ResultGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
}
