/**
 * Glossary Store
 *
 * Zustand store for managing personal glossary words with spaced repetition.
 * Persists to localStorage for offline learning.
 *
 * Features:
 * - Add/remove words to personal study list
 * - Track review progress with SM-2 spaced repetition
 * - Streak tracking for consistent learning
 * - Due word calculations
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  calculateNextReview,
  getQualityFromSwipe,
  getConfidenceLevel,
  DEFAULT_EASE_FACTOR,
} from '@/lib/spaced-repetition';

// Maximum words in personal glossary (prevents unbounded growth)
const MAX_WORDS = 500;

// =============================================================================
// TYPES
// =============================================================================

/**
 * Progress tracking for a single word
 */
export interface WordProgress {
  /** Term ID from glossary */
  termId: string;
  /** When the word was added to the list */
  addedAt: number;
  /** When the word was last reviewed (null if never) */
  lastReviewed: number | null;
  /** Total number of reviews completed */
  reviewCount: number;
  /** Confidence level (0-5) based on SM-2 performance */
  confidenceLevel: 0 | 1 | 2 | 3 | 4 | 5;
  /** Timestamp for when the next review is due */
  nextReviewAt: number | null;
  /** SM-2 ease factor (higher = easier) */
  easeFactor: number;
  /** Current interval in days between reviews */
  interval: number;
  /** Number of successful consecutive reviews */
  repetitions: number;
}

/**
 * Glossary state
 */
export interface GlossaryState {
  /** Personal word list with progress tracking */
  myWords: Record<string, WordProgress>;
  /** Cached array of word IDs (for stable reference) */
  myWordIds: string[];
  /** Current review streak (consecutive days) */
  reviewStreak: number;
  /** Longest streak ever achieved */
  longestStreak: number;
  /** Date of last review (YYYY-MM-DD format) */
  lastReviewDate: string | null;
  /** Total reviews completed all-time */
  totalReviews: number;
}

/**
 * Glossary actions
 */
export interface GlossaryActions {
  /** Add a word to personal study list (returns false if at limit) */
  addWord: (termId: string) => boolean;
  /** Remove a word from personal study list */
  removeWord: (termId: string) => void;
  /** Check if a word is in the list */
  hasWord: (termId: string) => boolean;
  /** Record a review for a word (swipe right = correct, left = incorrect) */
  recordReview: (termId: string, correct: boolean, confident?: boolean) => void;
  /** Get all words that are due for review */
  getWordsDueForReview: () => string[];
  /** Get count of words due for review */
  getDueCount: () => number;
  /** Get progress for a specific word */
  getWordProgress: (termId: string) => WordProgress | undefined;
  /** Reset all progress (keep words, reset reviews) */
  resetProgress: () => void;
  /** Get stats for the glossary */
  getStats: () => {
    totalWords: number;
    mastered: number;
    learning: number;
    dueToday: number;
    streak: number;
  };
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check if the last review date was yesterday
 */
function wasYesterday(dateString: string | null): boolean {
  if (!dateString) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0] === dateString;
}

/**
 * Check if the last review date was today
 */
function isToday(dateString: string | null): boolean {
  if (!dateString) return false;
  return getTodayString() === dateString;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: GlossaryState = {
  myWords: {},
  myWordIds: [],
  reviewStreak: 0,
  longestStreak: 0,
  lastReviewDate: null,
  totalReviews: 0,
};

// =============================================================================
// STORE
// =============================================================================

export const useGlossaryStore = create<GlossaryState & GlossaryActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addWord: (termId: string) => {
        const state = get();
        if (state.myWords[termId]) {
          return true; // Already exists
        }

        if (state.myWordIds.length >= MAX_WORDS) {
          return false; // At limit
        }

        const newWord: WordProgress = {
          termId,
          addedAt: Date.now(),
          lastReviewed: null,
          reviewCount: 0,
          confidenceLevel: 0,
          nextReviewAt: Date.now(),
          easeFactor: DEFAULT_EASE_FACTOR,
          interval: 0,
          repetitions: 0,
        };

        set((prev) => ({
          myWords: { ...prev.myWords, [termId]: newWord },
          myWordIds: [...prev.myWordIds, termId],
        }));

        return true;
      },

      removeWord: (termId: string) => {
        set((prev) => {
          const newWords = { ...prev.myWords };
          delete newWords[termId];
          return {
            myWords: newWords,
            myWordIds: prev.myWordIds.filter((id) => id !== termId),
          };
        });
      },

      hasWord: (termId: string) => {
        return !!get().myWords[termId];
      },

      recordReview: (termId: string, correct: boolean, confident?: boolean) => {
        const state = get();
        const word = state.myWords[termId];
        if (!word) return;

        // Calculate quality rating from swipe
        const quality = getQualityFromSwipe(correct, confident);

        // Calculate next review using SM-2
        const result = calculateNextReview(quality, {
          easeFactor: word.easeFactor,
          interval: word.interval,
          repetitions: word.repetitions,
        });

        // Calculate new confidence level
        const confidenceLevel = getConfidenceLevel(result.easeFactor, result.repetitions);

        // Update streak
        const today = getTodayString();
        let newStreak = state.reviewStreak;

        if (!isToday(state.lastReviewDate)) {
          // First review today
          if (wasYesterday(state.lastReviewDate)) {
            // Continue streak
            newStreak = state.reviewStreak + 1;
          } else {
            // Streak broken or first review ever
            newStreak = 1;
          }
        }

        const newLongestStreak = Math.max(newStreak, state.longestStreak);

        // Update state
        set((prev) => ({
          myWords: {
            ...prev.myWords,
            [termId]: {
              ...word,
              lastReviewed: Date.now(),
              reviewCount: word.reviewCount + 1,
              confidenceLevel,
              nextReviewAt: result.nextReviewAt,
              easeFactor: result.easeFactor,
              interval: result.interval,
              repetitions: result.repetitions,
            },
          },
          reviewStreak: newStreak,
          longestStreak: newLongestStreak,
          lastReviewDate: today,
          totalReviews: prev.totalReviews + 1,
        }));
      },

      getWordsDueForReview: () => {
        const state = get();
        const now = Date.now();
        return state.myWordIds.filter((termId) => {
          const word = state.myWords[termId];
          return word && (word.nextReviewAt === null || word.nextReviewAt <= now);
        });
      },

      getDueCount: () => {
        return get().getWordsDueForReview().length;
      },

      getWordProgress: (termId: string) => {
        return get().myWords[termId];
      },

      resetProgress: () => {
        const state = get();
        const resetWords: Record<string, WordProgress> = {};

        Object.keys(state.myWords).forEach((termId) => {
          resetWords[termId] = {
            termId,
            addedAt: state.myWords[termId].addedAt,
            lastReviewed: null,
            reviewCount: 0,
            confidenceLevel: 0,
            nextReviewAt: Date.now(),
            easeFactor: DEFAULT_EASE_FACTOR,
            interval: 0,
            repetitions: 0,
          };
        });

        set({
          myWords: resetWords,
          reviewStreak: 0,
          lastReviewDate: null,
          totalReviews: 0,
          // Keep longest streak as a record
        });
      },

      getStats: () => {
        const state = get();
        const words = Object.values(state.myWords);
        const now = Date.now();

        return {
          totalWords: words.length,
          mastered: words.filter((w) => w.confidenceLevel >= 4).length,
          learning: words.filter((w) => w.confidenceLevel > 0 && w.confidenceLevel < 4).length,
          dueToday: words.filter((w) => w.nextReviewAt === null || w.nextReviewAt <= now).length,
          streak: state.reviewStreak,
        };
      },
    }),
    {
      name: 'willy-glossary-store',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

/** Select the list of word IDs (stable reference) */
export const selectMyWordIds = (state: GlossaryState) => state.myWordIds;

/** Select the current review streak */
export const selectReviewStreak = (state: GlossaryState) => state.reviewStreak;

/** Select the longest streak */
export const selectLongestStreak = (state: GlossaryState) => state.longestStreak;

/** Select total reviews */
export const selectTotalReviews = (state: GlossaryState) => state.totalReviews;

/** Select word count */
export const selectWordCount = (state: GlossaryState) => state.myWordIds.length;
