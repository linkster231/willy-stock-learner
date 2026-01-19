/**
 * Spaced Repetition Algorithm (SM-2)
 *
 * Implements the SuperMemo 2 algorithm for optimal flashcard review timing.
 * This helps learners retain vocabulary by scheduling reviews at increasing intervals.
 *
 * Quality Ratings:
 * 0 - Complete blackout, no recall at all
 * 1 - Incorrect response, but recognized after seeing answer
 * 2 - Incorrect response, but answer seemed easy to recall
 * 3 - Correct response with serious difficulty
 * 4 - Correct response with some hesitation
 * 5 - Perfect response, instant recall
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ReviewResult {
  /** New ease factor (minimum 1.3) */
  easeFactor: number;
  /** Number of days until next review */
  interval: number;
  /** Number of successful repetitions */
  repetitions: number;
  /** Timestamp for the next review */
  nextReviewAt: number;
}

export interface CardState {
  /** Current ease factor (default 2.5) */
  easeFactor: number;
  /** Current interval in days */
  interval: number;
  /** Number of successful repetitions */
  repetitions: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Default ease factor for new cards */
export const DEFAULT_EASE_FACTOR = 2.5;

/** Minimum ease factor (prevents intervals from becoming too short) */
export const MIN_EASE_FACTOR = 1.3;

/** First interval in days after first successful review */
const FIRST_INTERVAL = 1;

/** Second interval in days after second successful review */
const SECOND_INTERVAL = 6;

/** Milliseconds in a day */
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// =============================================================================
// ALGORITHM
// =============================================================================

/**
 * Calculate the next review state based on SM-2 algorithm
 *
 * @param quality - Quality rating (0-5) of the response
 * @param currentState - Current state of the card (or defaults for new cards)
 * @returns New review state including next review date
 *
 * @example
 * // For a new card answered correctly with hesitation
 * const result = calculateNextReview(4, {
 *   easeFactor: 2.5,
 *   interval: 0,
 *   repetitions: 0
 * });
 * // result.interval = 1 (review tomorrow)
 * // result.repetitions = 1
 */
export function calculateNextReview(
  quality: number,
  currentState: CardState = {
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
  }
): ReviewResult {
  // Validate quality rating
  const clampedQuality = Math.max(0, Math.min(5, Math.round(quality)));

  let { easeFactor, interval, repetitions } = currentState;

  // If quality is below 3, the response was incorrect
  // Reset to the beginning but maintain the ease factor
  if (clampedQuality < 3) {
    return {
      easeFactor: Math.max(
        MIN_EASE_FACTOR,
        easeFactor + (0.1 - (5 - clampedQuality) * (0.08 + (5 - clampedQuality) * 0.02))
      ),
      interval: FIRST_INTERVAL,
      repetitions: 0,
      nextReviewAt: Date.now() + FIRST_INTERVAL * MS_PER_DAY,
    };
  }

  // Quality >= 3 means the response was correct
  // Calculate new ease factor using SM-2 formula
  const newEaseFactor = Math.max(
    MIN_EASE_FACTOR,
    easeFactor + (0.1 - (5 - clampedQuality) * (0.08 + (5 - clampedQuality) * 0.02))
  );

  // Calculate new interval based on repetition count
  let newInterval: number;
  if (repetitions === 0) {
    newInterval = FIRST_INTERVAL;
  } else if (repetitions === 1) {
    newInterval = SECOND_INTERVAL;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: repetitions + 1,
    nextReviewAt: Date.now() + newInterval * MS_PER_DAY,
  };
}

/**
 * Calculate quality rating from a simple swipe action
 *
 * @param correct - Whether the user knew the answer
 * @param confident - Whether the user was confident (optional)
 * @returns Quality rating (0-5)
 *
 * @example
 * // User swiped right (knew it)
 * const quality = getQualityFromSwipe(true); // Returns 4
 *
 * // User swiped left (didn't know)
 * const quality = getQualityFromSwipe(false); // Returns 1
 */
export function getQualityFromSwipe(correct: boolean, confident?: boolean): number {
  if (!correct) {
    return 1; // Incorrect, but will recognize after seeing answer
  }
  return confident ? 5 : 4; // Perfect or correct with hesitation
}

/**
 * Get a human-readable description of when the next review is due
 *
 * @param nextReviewAt - Timestamp of the next review
 * @returns Human-readable string
 *
 * @example
 * getNextReviewLabel(Date.now() + 86400000); // "Tomorrow"
 * getNextReviewLabel(Date.now() + 7 * 86400000); // "In 7 days"
 */
export function getNextReviewLabel(nextReviewAt: number): string {
  const now = Date.now();
  const diffDays = Math.round((nextReviewAt - now) / MS_PER_DAY);

  if (diffDays <= 0) {
    return 'Due now';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.round(diffDays / 7);
    return `In ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.round(diffDays / 30);
    return `In ${months} month${months > 1 ? 's' : ''}`;
  }
}

/**
 * Get the confidence level based on ease factor and repetitions
 *
 * @param easeFactor - Current ease factor
 * @param repetitions - Number of successful repetitions
 * @returns Confidence level 0-5 (0 = new, 5 = mastered)
 */
export function getConfidenceLevel(easeFactor: number, repetitions: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (repetitions === 0) return 0; // New
  if (repetitions === 1) return 1; // Learning
  if (repetitions === 2) return 2; // Familiar
  if (repetitions < 5) return 3; // Confident
  if (easeFactor >= 2.3) return 5; // Mastered
  return 4; // Almost mastered
}

/**
 * Get a color class based on confidence level
 *
 * @param level - Confidence level (0-5)
 * @returns Tailwind color class
 */
export function getConfidenceColor(level: 0 | 1 | 2 | 3 | 4 | 5): string {
  const colors: Record<number, string> = {
    0: 'bg-gray-200 text-gray-700', // New
    1: 'bg-red-100 text-red-700', // Learning
    2: 'bg-orange-100 text-orange-700', // Familiar
    3: 'bg-yellow-100 text-yellow-700', // Confident
    4: 'bg-blue-100 text-blue-700', // Almost mastered
    5: 'bg-green-100 text-green-700', // Mastered
  };
  return colors[level] || colors[0];
}

/**
 * Get a label for confidence level
 *
 * @param level - Confidence level (0-5)
 * @returns Human-readable label
 */
export function getConfidenceLabel(level: 0 | 1 | 2 | 3 | 4 | 5): string {
  const labels: Record<number, string> = {
    0: 'New',
    1: 'Learning',
    2: 'Familiar',
    3: 'Confident',
    4: 'Almost There',
    5: 'Mastered',
  };
  return labels[level] || labels[0];
}
