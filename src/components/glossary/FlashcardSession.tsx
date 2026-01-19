/**
 * Flashcard Session Component
 *
 * Manages a complete flashcard review session with:
 * - Progress tracking
 * - Streak display
 * - Session summary
 * - Swipe-based card navigation
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Flashcard } from './Flashcard';
import { useGlossaryStore } from '@/stores/useGlossaryStore';
import { getTermById } from '@/content/glossary/terms';

// =============================================================================
// TYPES
// =============================================================================

interface FlashcardSessionProps {
  /** List of term IDs to review */
  termIds: string[];
  /** Title for the session (e.g., "Due for Review", "All Words") */
  title?: string;
  /** Callback when session is complete */
  onComplete?: () => void;
}

interface SessionResult {
  termId: string;
  correct: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function FlashcardSession({ termIds, title, onComplete }: FlashcardSessionProps) {
  const t = useTranslations('glossary');
  const router = useRouter();

  // Store actions
  const recordReview = useGlossaryStore((state) => state.recordReview);
  const getWordProgress = useGlossaryStore((state) => state.getWordProgress);
  const reviewStreak = useGlossaryStore((state) => state.reviewStreak);

  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Get current term
  const currentTermId = termIds[currentIndex];
  const currentTerm = currentTermId ? getTermById(currentTermId) : null;
  const currentProgress = currentTermId ? getWordProgress(currentTermId) : undefined;

  // Calculate session stats
  const stats = useMemo(() => {
    const correct = results.filter((r) => r.correct).length;
    const incorrect = results.filter((r) => !r.correct).length;
    const accuracy = results.length > 0 ? Math.round((correct / results.length) * 100) : 0;
    return { correct, incorrect, accuracy, total: termIds.length };
  }, [results, termIds.length]);

  // Handle correct answer (swipe right)
  const handleCorrect = useCallback(() => {
    if (!currentTermId) return;

    // Record in store
    recordReview(currentTermId, true);

    // Track result
    setResults((prev) => [...prev, { termId: currentTermId, correct: true }]);

    // Move to next or complete
    if (currentIndex >= termIds.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentTermId, currentIndex, termIds.length, recordReview]);

  // Handle incorrect answer (swipe left)
  const handleIncorrect = useCallback(() => {
    if (!currentTermId) return;

    // Record in store
    recordReview(currentTermId, false);

    // Track result
    setResults((prev) => [...prev, { termId: currentTermId, correct: false }]);

    // Move to next or complete
    if (currentIndex >= termIds.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentTermId, currentIndex, termIds.length, recordReview]);

  // Handle session completion
  const handleDone = useCallback(() => {
    onComplete?.();
    router.push('/glossary');
  }, [onComplete, router]);

  // Handle review mistakes
  const handleReviewMistakes = useCallback(() => {
    const mistakeIds = results.filter((r) => !r.correct).map((r) => r.termId);
    if (mistakeIds.length > 0) {
      setCurrentIndex(0);
      setResults([]);
      setIsComplete(false);
      // Re-render with just the mistakes
      // Note: In a real implementation, we'd pass these IDs to a new session
    }
  }, [results]);

  // Empty state
  if (termIds.length === 0) {
    return (
      <Card className="mx-auto max-w-md p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('noCardsToReview')}</h2>
        <p className="text-gray-600 mb-6">{t('allCaughtUp')}</p>
        <Button onClick={() => router.push('/glossary')}>{t('backToGlossary')}</Button>
      </Card>
    );
  }

  // Session complete - show summary
  if (isComplete) {
    return (
      <div className="mx-auto max-w-md">
        <Card className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">
              {stats.accuracy >= 80 ? '🌟' : stats.accuracy >= 60 ? '👍' : '💪'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{t('sessionComplete')}</h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
              <p className="text-xs text-gray-500">{t('correct')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.incorrect}</p>
              <p className="text-xs text-gray-500">{t('needsReview')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.accuracy}%</p>
              <p className="text-xs text-gray-500">{t('accuracy')}</p>
            </div>
          </div>

          {/* Streak */}
          {reviewStreak > 0 && (
            <div className="mb-6 rounded-lg bg-orange-50 p-4 text-center">
              <p className="text-lg">
                🔥 <span className="font-bold text-orange-600">{reviewStreak}</span>{' '}
                {t('dayStreak')}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {stats.incorrect > 0 && (
              <Button variant="secondary" fullWidth onClick={handleReviewMistakes}>
                🔄 {t('reviewMistakes')} ({stats.incorrect})
              </Button>
            )}
            <Button fullWidth onClick={handleDone}>
              {t('done')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active session
  return (
    <div className="mx-auto max-w-md px-4">
      {/* Header with progress */}
      <div className="mb-6">
        {title && <h2 className="text-xl font-bold text-gray-900 text-center mb-2">{title}</h2>}

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / termIds.length) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {currentIndex + 1} / {termIds.length}
          </span>
        </div>

        {/* Streak indicator */}
        {reviewStreak > 0 && (
          <p className="text-center text-sm text-orange-600 mt-2">
            🔥 {reviewStreak} {t('dayStreak')}
          </p>
        )}
      </div>

      {/* Current Card */}
      {currentTerm && (
        <Flashcard
          term={currentTerm}
          progress={currentProgress}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          isActive={true}
        />
      )}

      {/* Session Stats */}
      <div className="mt-6 flex justify-center gap-6 text-sm">
        <span className="text-green-600">✓ {stats.correct}</span>
        <span className="text-red-600">✗ {stats.incorrect}</span>
      </div>

      {/* Instructions */}
      <p className="mt-4 text-center text-xs text-gray-400">
        {t('swipeInstructions')}
      </p>
    </div>
  );
}

export default FlashcardSession;
