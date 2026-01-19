/**
 * Lesson Card Component
 *
 * Card showing a lesson with title, duration, and completion status.
 * Used in module detail pages to show available lessons.
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/types/content';

interface LessonCardProps {
  /** The lesson data to display */
  lesson: Lesson;
  /** Whether the user has completed this lesson */
  isCompleted: boolean;
  /** Whether the lesson is locked (prerequisite not met) */
  isLocked: boolean;
  /** Click handler for when the lesson is selected */
  onClick: () => void;
  /** Custom class name */
  className?: string;
}

/**
 * Card displaying a single lesson with its status.
 *
 * @example
 * <LessonCard
 *   lesson={lesson}
 *   isCompleted={false}
 *   isLocked={false}
 *   onClick={() => router.push(`/learn/${moduleId}/${lesson.id}`)}
 * />
 */
export function LessonCard({
  lesson,
  isCompleted,
  isLocked,
  onClick,
  className,
}: LessonCardProps) {
  const t = useTranslations('learning');
  const tContent = useTranslations('content');

  const handleClick = () => {
    if (!isLocked) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        'relative transition-all duration-200',
        // Completed state
        isCompleted && 'border-green-200 bg-green-50/50',
        // Locked state
        isLocked && 'cursor-not-allowed opacity-60',
        // Interactive state
        !isLocked && 'cursor-pointer hover:shadow-md hover:border-blue-200',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isLocked ? -1 : 0}
      role="button"
      aria-disabled={isLocked}
      aria-label={
        isLocked
          ? t('lessonLocked', { title: tContent(lesson.titleKey) })
          : isCompleted
          ? t('lessonCompleted', { title: tContent(lesson.titleKey) })
          : tContent(lesson.titleKey)
      }
    >
      {/* Lesson content */}
      <div className="flex items-start gap-4">
        {/* Status icon */}
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
            isCompleted
              ? 'bg-green-100 text-green-600'
              : isLocked
              ? 'bg-gray-100 text-gray-400'
              : 'bg-blue-100 text-blue-600'
          )}
        >
          {isCompleted ? (
            // Checkmark icon
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : isLocked ? (
            // Lock icon
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ) : (
            // Play icon
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Lesson info */}
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-medium',
              isCompleted
                ? 'text-green-800'
                : isLocked
                ? 'text-gray-500'
                : 'text-gray-900'
            )}
          >
            {tContent(lesson.titleKey)}
          </h3>

          {/* Duration and video indicator */}
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            {/* Duration */}
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
              {t('duration', { minutes: lesson.duration })}
            </span>

            {/* Video indicator */}
            {lesson.videoUrl && (
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
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {t('hasVideo')}
              </span>
            )}
          </div>
        </div>

        {/* Arrow indicator for unlocked lessons */}
        {!isLocked && (
          <div className="flex-shrink-0 text-gray-400">
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </Card>
  );
}
