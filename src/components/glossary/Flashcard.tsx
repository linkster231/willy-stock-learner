/**
 * Flashcard Component
 *
 * Interactive flashcard with 3D flip animation.
 * Supports swipe gestures for mobile learning.
 *
 * Swipe right = knew the answer (correct)
 * Swipe left = didn't know (review again)
 */

'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { getConfidenceColor, getConfidenceLabel } from '@/lib/spaced-repetition';
import type { GlossaryTerm } from '@/types/content';
import type { WordProgress } from '@/stores/useGlossaryStore';

// =============================================================================
// TYPES
// =============================================================================

interface FlashcardProps {
  /** The glossary term to display */
  term: GlossaryTerm;
  /** Progress data for the term (optional) */
  progress?: WordProgress;
  /** Callback when user swipes right (knew it) */
  onCorrect: () => void;
  /** Callback when user swipes left (didn't know) */
  onIncorrect: () => void;
  /** Whether this card is currently active (for animation) */
  isActive?: boolean;
  /** Custom className */
  className?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Minimum swipe distance to trigger action (pixels) */
const SWIPE_THRESHOLD = 100;

/** Maximum rotation angle during swipe (degrees) */
const MAX_ROTATION = 15;

// =============================================================================
// COMPONENT
// =============================================================================

export function Flashcard({
  term,
  progress,
  onCorrect,
  onIncorrect,
  isActive = true,
  className,
}: FlashcardProps) {
  const t = useTranslations();

  // State
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  // Refs
  const startX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Flip the card
  const handleFlip = useCallback(() => {
    if (!isDragging) {
      setIsFlipped((prev) => !prev);
    }
  }, [isDragging]);

  // Touch/mouse handlers for swipe
  const handleDragStart = useCallback((clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      const diff = clientX - startX.current;
      setDragX(diff);
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check if swipe threshold was met
    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      const direction = dragX > 0 ? 'right' : 'left';
      setExitDirection(direction);

      // Wait for exit animation, then trigger callback
      setTimeout(() => {
        if (direction === 'right') {
          onCorrect();
        } else {
          onIncorrect();
        }
        // Reset for next card
        setDragX(0);
        setExitDirection(null);
        setIsFlipped(false);
      }, 300);
    } else {
      // Spring back
      setDragX(0);
    }
  }, [isDragging, dragX, onCorrect, onIncorrect]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Calculate card styles based on drag position
  const rotation = (dragX / SWIPE_THRESHOLD) * MAX_ROTATION;
  const opacity = exitDirection
    ? 0
    : Math.max(0.5, 1 - Math.abs(dragX) / (SWIPE_THRESHOLD * 3));

  // Swipe indicator colors
  const swipeIndicator =
    dragX > SWIPE_THRESHOLD / 2
      ? 'correct'
      : dragX < -SWIPE_THRESHOLD / 2
        ? 'incorrect'
        : null;

  // Confidence badge
  const confidenceLevel = progress?.confidenceLevel ?? 0;

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative touch-none select-none',
        !isActive && 'pointer-events-none',
        className
      )}
      style={{
        transform: exitDirection
          ? `translateX(${exitDirection === 'right' ? '150%' : '-150%'}) rotate(${exitDirection === 'right' ? 30 : -30}deg)`
          : `translateX(${dragX}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Swipe Indicators */}
      <div
        className={cn(
          'absolute -left-4 top-1/2 -translate-y-1/2 rounded-full p-3 transition-opacity',
          swipeIndicator === 'incorrect' ? 'opacity-100 bg-red-500' : 'opacity-0'
        )}
      >
        <span className="text-2xl text-white">✗</span>
      </div>
      <div
        className={cn(
          'absolute -right-4 top-1/2 -translate-y-1/2 rounded-full p-3 transition-opacity',
          swipeIndicator === 'correct' ? 'opacity-100 bg-green-500' : 'opacity-0'
        )}
      >
        <span className="text-2xl text-white">✓</span>
      </div>

      {/* Card Container with 3D perspective */}
      <div
        className="perspective-1000 cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <div
          className={cn(
            'relative h-64 w-full transform-style-3d transition-transform duration-500',
            isFlipped && '[transform:rotateY(180deg)]'
          )}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card (Term) */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl bg-white p-6 shadow-lg border-2 border-gray-100"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex h-full flex-col">
              {/* Header with confidence badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-600">
                  {term.category}
                </span>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    getConfidenceColor(confidenceLevel)
                  )}
                >
                  {getConfidenceLabel(confidenceLevel)}
                </span>
              </div>

              {/* Term */}
              <div className="flex flex-1 items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  {t(term.termKey)}
                </h2>
              </div>

              {/* Tap hint */}
              <p className="text-center text-sm text-gray-400">Tap to reveal definition</p>
            </div>
          </div>

          {/* Back of card (Definition) */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl bg-blue-50 p-6 shadow-lg border-2 border-blue-100 [transform:rotateY(180deg)]"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex h-full flex-col">
              {/* Term as header */}
              <h3 className="mb-3 text-lg font-semibold text-blue-900">
                {t(term.termKey)}
              </h3>

              {/* Definition */}
              <p className="flex-1 text-sm text-blue-800 leading-relaxed">
                {t(term.definitionKey)}
              </p>

              {/* Example if available */}
              {term.example && (
                <div className="mt-3 rounded-lg bg-blue-100 p-3">
                  <p className="text-xs font-medium text-blue-700">Example:</p>
                  <p className="text-xs text-blue-600 mt-1">{t(term.example)}</p>
                </div>
              )}

              {/* Swipe instructions */}
              <div className="mt-4 flex justify-between text-xs">
                <span className="text-red-600">← Swipe left: Review again</span>
                <span className="text-green-600">Swipe right: Got it! →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
