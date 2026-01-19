/**
 * Progress Bar Component
 *
 * Visual progress indicator with optional label.
 * Used to show module completion, lesson progress, etc.
 */

'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ProgressBarProps {
  /** Progress value from 0 to 100 */
  progress: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the percentage label */
  showLabel?: boolean;
  /** Custom class name */
  className?: string;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * Visual progress bar component.
 *
 * @example
 * <ProgressBar progress={75} size="md" showLabel />
 *
 * @example
 * <ProgressBar progress={50} size="sm" />
 */
export function ProgressBar({
  progress,
  size = 'md',
  showLabel = false,
  className,
  ariaLabel,
}: ProgressBarProps) {
  const t = useTranslations('learning');

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Size-specific styles for the progress bar track
  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  // Size-specific styles for the label text
  const labelSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Label above the bar */}
      {showLabel && (
        <div className="mb-1 flex justify-between items-center">
          <span className={cn('text-gray-600', labelSizeStyles[size])}>
            {t('progress')}
          </span>
          <span className={cn('font-medium text-gray-900', labelSizeStyles[size])}>
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}

      {/* Progress bar track */}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200',
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel || t('progressLabel', { progress: Math.round(clampedProgress) })}
      >
        {/* Progress bar fill */}
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            clampedProgress === 100
              ? 'bg-green-500'
              : clampedProgress >= 50
              ? 'bg-blue-500'
              : 'bg-blue-400'
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
