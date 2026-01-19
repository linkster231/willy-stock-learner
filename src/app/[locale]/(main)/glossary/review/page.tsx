/**
 * Flashcard Review Page
 *
 * Spaced repetition review session for words due for practice.
 * Uses swipe-based interaction for mobile-friendly learning.
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FlashcardSession } from '@/components/glossary';
import { useGlossaryStore } from '@/stores/useGlossaryStore';

export default function ReviewPage() {
  const t = useTranslations('glossary');
  const router = useRouter();

  // Get words due for review from store
  const getWordsDueForReview = useGlossaryStore((state) => state.getWordsDueForReview);
  const myWordIds = useGlossaryStore((state) => state.myWordIds);

  // State for term IDs to review
  const [termIds, setTermIds] = useState<string[]>([]);
  const [mode, setMode] = useState<'due' | 'all' | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load words on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Get due words
  const dueWords = isLoaded ? getWordsDueForReview() : [];

  // Mode selection
  if (!mode && isLoaded) {
    // No words added yet
    if (myWordIds.length === 0) {
      return (
        <div className="mx-auto max-w-md px-4 py-8">
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t('noWordsYet')}</h2>
            <p className="text-gray-600 mb-6">{t('addWordsPrompt')}</p>
            <Button onClick={() => router.push('/glossary')}>
              {t('browseGlossary')}
            </Button>
          </Card>
        </div>
      );
    }

    // Show mode selection
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('reviewTitle')}</h1>
          <p className="mt-2 text-gray-600">{t('chooseReviewMode')}</p>
        </div>

        <div className="space-y-4">
          {/* Review Due Words */}
          <Card
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              dueWords.length === 0 ? 'opacity-50' : ''
            }`}
            onClick={() => {
              if (dueWords.length > 0) {
                setTermIds(dueWords);
                setMode('due');
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">⏰</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{t('reviewDue')}</h3>
                <p className="text-sm text-gray-600">
                  {dueWords.length > 0
                    ? t('wordsDue', { count: dueWords.length })
                    : t('noDueWords')}
                </p>
              </div>
              {dueWords.length > 0 && (
                <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {dueWords.length}
                </div>
              )}
            </div>
          </Card>

          {/* Review All Words */}
          <Card
            className="p-6 cursor-pointer transition-all hover:shadow-lg"
            onClick={() => {
              setTermIds(myWordIds);
              setMode('all');
            }}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📖</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{t('reviewAll')}</h3>
                <p className="text-sm text-gray-600">
                  {t('allWordsCount', { count: myWordIds.length })}
                </p>
              </div>
              <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {myWordIds.length}
              </div>
            </div>
          </Card>
        </div>

        {/* Back to Glossary */}
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => router.push('/glossary')}>
            ← {t('backToGlossary')}
          </Button>
        </div>
      </div>
    );
  }

  // Active review session
  return (
    <div className="py-8">
      {/* Back button */}
      <div className="mb-4 px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setMode(null);
            setTermIds([]);
          }}
        >
          ← {t('back')}
        </Button>
      </div>

      <FlashcardSession
        termIds={termIds}
        title={mode === 'due' ? t('reviewingDue') : t('reviewingAll')}
        onComplete={() => {
          setMode(null);
          setTermIds([]);
        }}
      />
    </div>
  );
}
