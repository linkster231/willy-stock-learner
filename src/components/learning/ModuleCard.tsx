/**
 * Module Card Component
 *
 * Card showing a module overview with progress and quiz status.
 * Used on the main learning page to show available modules.
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';
import type { Module } from '@/types/content';

interface ModuleCardProps {
  /** The module data to display */
  module: Module;
  /** Progress percentage (0-100) */
  progress: number;
  /** Whether the module is locked (prerequisites not met) */
  isLocked: boolean;
  /** Whether the quiz has been passed */
  quizPassed?: boolean;
  /** Click handler for when the module is selected */
  onClick?: () => void;
  /** Custom class name */
  className?: string;
}

/**
 * Card displaying a learning module with progress.
 *
 * @example
 * <ModuleCard
 *   module={module}
 *   progress={75}
 *   isLocked={false}
 *   quizPassed={true}
 *   onClick={() => router.push(`/learn/${module.id}`)}
 * />
 */
export function ModuleCard({
  module,
  progress,
  isLocked,
  quizPassed,
  onClick,
  className,
}: ModuleCardProps) {
  const t = useTranslations('learning');
  const tContent = useTranslations('content');

  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isLocked && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  // Determine the status badge to show
  const getStatusBadge = () => {
    if (isLocked) {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          <svg
            className="mr-1 h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          {t('locked')}
        </span>
      );
    }

    if (quizPassed) {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          <svg
            className="mr-1 h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {t('completed')}
        </span>
      );
    }

    if (progress > 0 && progress < 100) {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {t('inProgress')}
        </span>
      );
    }

    return null;
  };

  return (
    <Card
      className={cn(
        'relative transition-all duration-200',
        // Locked state
        isLocked && 'cursor-not-allowed opacity-60',
        // Completed state
        quizPassed && 'border-green-200',
        // Interactive state
        !isLocked && onClick && 'cursor-pointer hover:shadow-md hover:border-blue-200',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isLocked || !onClick ? -1 : 0}
      role={onClick ? 'button' : undefined}
      aria-disabled={isLocked}
      aria-label={
        isLocked
          ? t('moduleLocked', { title: tContent(module.titleKey) })
          : quizPassed
          ? t('moduleCompleted', { title: tContent(module.titleKey) })
          : tContent(module.titleKey)
      }
    >
      {/* Header with icon and status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Module icon */}
          <span className="text-3xl" aria-hidden="true">
            {module.icon}
          </span>
          <div>
            <h3
              className={cn(
                'font-semibold text-lg',
                isLocked ? 'text-gray-500' : 'text-gray-900'
              )}
            >
              {tContent(module.titleKey)}
            </h3>
            <p
              className={cn(
                'text-sm mt-0.5',
                isLocked ? 'text-gray-400' : 'text-gray-600'
              )}
            >
              {tContent(module.descriptionKey)}
            </p>
          </div>
        </div>

        {/* Status badge */}
        {getStatusBadge()}
      </div>

      {/* Module metadata */}
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        {/* Lessons count */}
        <span className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          {t('lessonsCount', { count: module.lessons.length })}
        </span>

        {/* Estimated time */}
        <span className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {t('estimatedTime', { hours: module.estimatedHours })}
        </span>
      </div>

      {/* Progress bar */}
      {!isLocked && (
        <div className="mt-4">
          <ProgressBar
            progress={progress}
            size="sm"
            ariaLabel={t('moduleProgress', {
              title: tContent(module.titleKey),
              progress: Math.round(progress),
            })}
          />
        </div>
      )}

      {/* Locked message */}
      {isLocked && module.prerequisites.length > 0 && (
        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
          <p>{t('prerequisitesRequired')}</p>
        </div>
      )}
    </Card>
  );
}
