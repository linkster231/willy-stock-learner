/**
 * Quiz Results Component
 *
 * Shows quiz results with pass/fail status and actions.
 * Displays score, feedback, and navigation options.
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface QuizResultsProps {
  /** Number of correct answers */
  score: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Whether the user passed the quiz */
  passed: boolean;
  /** Handler for retrying the quiz */
  onRetry: () => void;
  /** Handler for continuing to next module */
  onContinue: () => void;
  /** Custom class name */
  className?: string;
  /** Whether this is the final review challenge */
  isFinalReview?: boolean;
}

/**
 * Quiz results display with score and actions.
 *
 * @example
 * <QuizResults
 *   score={8}
 *   totalQuestions={10}
 *   passed={true}
 *   onRetry={() => resetQuiz()}
 *   onContinue={() => router.push('/learn')}
 * />
 */
export function QuizResults({
  score,
  totalQuestions,
  passed,
  onRetry,
  onContinue,
  className,
  isFinalReview = false,
}: QuizResultsProps) {
  const t = useTranslations('learn.quiz.results');

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <Card
      className={cn(
        'text-center',
        passed ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50',
        className
      )}
    >
      {/* Result icon */}
      <div className="flex justify-center mb-4">
        <div
          className={cn(
            'flex h-20 w-20 items-center justify-center rounded-full',
            passed ? 'bg-green-100' : 'bg-amber-100'
          )}
        >
          {passed ? (
            // Trophy icon for passing
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          ) : (
            // Retry icon for failing
            <svg
              className="h-10 w-10 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Result title */}
      <h2
        className={cn(
          'text-2xl font-bold mb-2',
          passed ? 'text-green-800' : 'text-amber-800'
        )}
      >
        {isFinalReview
          ? passed
            ? t('finalReviewPassed')
            : t('finalReviewFailed')
          : passed
          ? t('quizPassed')
          : t('quizFailed')}
      </h2>

      {/* Score display */}
      <div className="mb-4">
        <p className={cn('text-lg', passed ? 'text-green-700' : 'text-amber-700')}>
          {t('scoreDisplay', { score, total: totalQuestions })}
        </p>
        <p
          className={cn(
            'text-4xl font-bold mt-2',
            passed ? 'text-green-600' : 'text-amber-600'
          )}
        >
          {percentage}%
        </p>
      </div>

      {/* Score visualization */}
      <div className="flex justify-center gap-1 mb-6" aria-hidden="true">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-3 w-3 rounded-full transition-colors',
              index < score
                ? passed
                  ? 'bg-green-500'
                  : 'bg-amber-500'
                : 'bg-gray-300'
            )}
          />
        ))}
      </div>

      {/* Feedback message */}
      <p
        className={cn(
          'mb-6 text-sm',
          passed ? 'text-green-700' : 'text-amber-700'
        )}
      >
        {passed ? t('quizPassedMessage') : t('quizFailedMessage')}
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {passed ? (
          <>
            <Button
              variant="success"
              size="lg"
              onClick={onContinue}
              className="min-w-[140px]"
            >
              {t('continueButton')}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onRetry}
              className="min-w-[140px]"
            >
              {t('retryButton')}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={onRetry}
              className="min-w-[140px]"
            >
              {t('tryAgainButton')}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onContinue}
              className="min-w-[140px]"
            >
              {t('reviewLessonsButton')}
            </Button>
          </>
        )}
      </div>

      {/* Encouragement for failed attempts */}
      {!passed && (
        <div className="mt-6 rounded-lg bg-white/60 p-4">
          <p className="text-sm text-gray-600">
            {t('quizTip')}
          </p>
        </div>
      )}
    </Card>
  );
}
