/**
 * My Words Page
 *
 * View and manage personal word list with spaced repetition progress.
 * Shows confidence levels, next review dates, and learning stats.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useGlossaryStore } from '@/stores/useGlossaryStore';
import { getTermById } from '@/content/glossary/terms';
import {
  getConfidenceColor,
  getConfidenceLabel,
  getNextReviewLabel,
} from '@/lib/spaced-repetition';

export default function MyWordsPage() {
  const t = useTranslations('glossary');
  const tTerms = useTranslations();

  // Store state and actions
  const myWordIds = useGlossaryStore((state) => state.myWordIds);
  const myWords = useGlossaryStore((state) => state.myWords);
  const removeWord = useGlossaryStore((state) => state.removeWord);
  const getStats = useGlossaryStore((state) => state.getStats);
  const reviewStreak = useGlossaryStore((state) => state.reviewStreak);
  const longestStreak = useGlossaryStore((state) => state.longestStreak);

  // For hydration safety
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get stats
  const stats = isLoaded ? getStats() : { totalWords: 0, mastered: 0, learning: 0, dueToday: 0, streak: 0 };

  // Sort words by next review date (due first)
  const sortedWordIds = isLoaded
    ? [...myWordIds].sort((a, b) => {
        const wordA = myWords[a];
        const wordB = myWords[b];
        const nextA = wordA?.nextReviewAt ?? 0;
        const nextB = wordB?.nextReviewAt ?? 0;
        return nextA - nextB;
      })
    : [];

  // Empty state
  if (isLoaded && myWordIds.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('noWordsYet')}</h2>
          <p className="text-gray-600 mb-6">{t('addWordsPrompt')}</p>
          <Link href="/glossary">
            <Button>{t('browseGlossary')}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('myWordsTitle')}</h1>
        <p className="mt-2 text-gray-600">{t('myWordsSubtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.totalWords}</p>
          <p className="text-xs text-gray-500">{t('totalWords')}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.mastered}</p>
          <p className="text-xs text-gray-500">{t('mastered')}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.learning}</p>
          <p className="text-xs text-gray-500">{t('learning')}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{stats.dueToday}</p>
          <p className="text-xs text-gray-500">{t('dueToday')}</p>
        </Card>
      </div>

      {/* Streak Display */}
      {(reviewStreak > 0 || longestStreak > 0) && (
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-semibold text-gray-900">
                  {reviewStreak} {t('dayStreak')}
                </p>
                {longestStreak > reviewStreak && (
                  <p className="text-xs text-gray-500">
                    {t('bestStreak')}: {longestStreak} {t('days')}
                  </p>
                )}
              </div>
            </div>
            {stats.dueToday > 0 && (
              <Link href="/glossary/review">
                <Button size="sm">{t('reviewNow')}</Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/glossary/review">
          <Button>🎴 {t('startReview')}</Button>
        </Link>
        <Link href="/glossary">
          <Button variant="secondary">← {t('backToGlossary')}</Button>
        </Link>
      </div>

      {/* Word List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('yourWords')}</CardTitle>
        </CardHeader>
        <div className="divide-y divide-gray-100">
          {sortedWordIds.map((termId) => {
            const term = getTermById(termId);
            const progress = myWords[termId];

            if (!term || !progress) return null;

            const confidenceLevel = progress.confidenceLevel;
            const isDue = progress.nextReviewAt && progress.nextReviewAt <= Date.now();

            return (
              <div
                key={termId}
                className={cn(
                  'flex items-center gap-4 p-4 transition-colors',
                  isDue && 'bg-yellow-50'
                )}
              >
                {/* Confidence Badge */}
                <span
                  className={cn(
                    'rounded-full px-2 py-1 text-xs font-medium',
                    getConfidenceColor(confidenceLevel)
                  )}
                >
                  {getConfidenceLabel(confidenceLevel)}
                </span>

                {/* Term Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {tTerms(term.termKey)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {progress.reviewCount} {t('reviews')} •{' '}
                    {progress.nextReviewAt
                      ? getNextReviewLabel(progress.nextReviewAt)
                      : t('newWord')}
                  </p>
                </div>

                {/* Due indicator */}
                {isDue && (
                  <span className="text-xs text-yellow-700 font-medium">
                    {t('due')}
                  </span>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeWord(termId)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title={t('removeFromList')}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
