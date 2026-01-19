/**
 * Quiz Question Component
 *
 * Interactive quiz question with selectable options.
 * Shows feedback after submission.
 */

'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { QuizQuestion as QuizQuestionType } from '@/types/content';

interface QuizQuestionProps {
  /** The question data */
  question: QuizQuestionType;
  /** Currently selected answer option ID */
  selectedAnswer?: string;
  /** Whether the answer has been submitted */
  isSubmitted: boolean;
  /** Handler when an option is selected */
  onSelect: (optionId: string) => void;
  /** Question number for display */
  questionNumber?: number;
  /** Total number of questions */
  totalQuestions?: number;
  /** Custom class name */
  className?: string;
}

/**
 * Interactive quiz question component.
 *
 * @example
 * <QuizQuestion
 *   question={question}
 *   selectedAnswer={selectedId}
 *   isSubmitted={false}
 *   onSelect={(id) => setSelectedId(id)}
 * />
 */
export function QuizQuestion({
  question,
  selectedAnswer,
  isSubmitted,
  onSelect,
  questionNumber,
  totalQuestions,
  className,
}: QuizQuestionProps) {
  const t = useTranslations('learning');
  const tContent = useTranslations('content');

  const isCorrect = selectedAnswer === question.correctOptionId;

  return (
    <Card className={cn('space-y-4', className)}>
      {/* Question header */}
      {questionNumber !== undefined && totalQuestions !== undefined && (
        <div className="text-sm text-gray-500">
          {t('questionNumber', { current: questionNumber, total: totalQuestions })}
        </div>
      )}

      {/* Question text */}
      <h3 className="text-lg font-medium text-gray-900">
        {tContent(question.questionKey)}
      </h3>

      {/* Options */}
      <div className="space-y-3" role="radiogroup" aria-label={tContent(question.questionKey)}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrectOption = option.id === question.correctOptionId;

          // Determine option state for styling
          let optionState: 'default' | 'selected' | 'correct' | 'incorrect' = 'default';
          if (isSubmitted) {
            if (isCorrectOption) {
              optionState = 'correct';
            } else if (isSelected && !isCorrectOption) {
              optionState = 'incorrect';
            }
          } else if (isSelected) {
            optionState = 'selected';
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => !isSubmitted && onSelect(option.id)}
              disabled={isSubmitted}
              className={cn(
                // Base styles - good touch target
                'w-full flex items-center gap-3 rounded-lg border p-4 text-left',
                'min-h-[48px] transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                // State-based styles
                optionState === 'default' && [
                  'border-gray-200 bg-white',
                  !isSubmitted && 'hover:border-blue-300 hover:bg-blue-50 active:bg-blue-100',
                ],
                optionState === 'selected' && [
                  'border-blue-500 bg-blue-50',
                  !isSubmitted && 'hover:bg-blue-100',
                ],
                optionState === 'correct' && 'border-green-500 bg-green-50',
                optionState === 'incorrect' && 'border-red-500 bg-red-50',
                // Disabled styles
                isSubmitted && 'cursor-default'
              )}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isSubmitted}
            >
              {/* Option indicator */}
              <div
                className={cn(
                  'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2',
                  optionState === 'default' && 'border-gray-300',
                  optionState === 'selected' && 'border-blue-500 bg-blue-500',
                  optionState === 'correct' && 'border-green-500 bg-green-500',
                  optionState === 'incorrect' && 'border-red-500 bg-red-500'
                )}
              >
                {(optionState === 'selected' ||
                  optionState === 'correct' ||
                  optionState === 'incorrect') && (
                  <span
                    className={cn(
                      'text-white',
                      optionState === 'correct' || optionState === 'incorrect'
                        ? 'text-sm'
                        : 'h-2 w-2 rounded-full bg-white'
                    )}
                  >
                    {optionState === 'correct' && (
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
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {optionState === 'incorrect' && (
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
                          strokeWidth={3}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    {optionState === 'selected' && !isSubmitted && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                )}
              </div>

              {/* Option text */}
              <span
                className={cn(
                  'flex-1',
                  optionState === 'default' && 'text-gray-700',
                  optionState === 'selected' && 'text-blue-900 font-medium',
                  optionState === 'correct' && 'text-green-800 font-medium',
                  optionState === 'incorrect' && 'text-red-800 font-medium'
                )}
              >
                {tContent(option.labelKey)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after submission) */}
      {isSubmitted && (
        <div
          className={cn(
            'rounded-lg p-4 mt-4',
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full',
                isCorrect ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              )}
            >
              {isCorrect ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p
                className={cn(
                  'font-medium mb-1',
                  isCorrect ? 'text-green-800' : 'text-amber-800'
                )}
              >
                {isCorrect ? t('correct') : t('incorrect')}
              </p>
              <p className={cn(isCorrect ? 'text-green-700' : 'text-amber-700')}>
                {tContent(question.explanationKey)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
