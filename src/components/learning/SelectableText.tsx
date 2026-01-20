/**
 * Selectable Text Component
 *
 * Allows users to select/highlight words to look up definitions from the glossary.
 * Shows a tooltip with the definition when a word is selected.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { glossaryTerms } from '@/content/glossary';
import { cn } from '@/lib/utils';

interface SelectableTextProps {
  /** The text content to display */
  children: string;
  /** Additional CSS classes */
  className?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  word: string;
  definition: string | null;
  termId: string | null;
}

/**
 * Text component that allows word selection for glossary lookup.
 */
export function SelectableText({ children, className }: SelectableTextProps) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    word: '',
    definition: null,
    termId: null,
  });

  // Find a glossary term that matches the selected word
  const findGlossaryTerm = useCallback((word: string) => {
    const normalizedWord = word.toLowerCase().trim();

    // Search for exact match or partial match in glossary terms
    const matchedTerm = glossaryTerms.find((term) => {
      const termWord = t(term.termKey).toLowerCase();
      return (
        termWord === normalizedWord ||
        termWord.includes(normalizedWord) ||
        normalizedWord.includes(termWord)
      );
    });

    if (matchedTerm) {
      return {
        definition: t(matchedTerm.definitionKey),
        termId: matchedTerm.id,
      };
    }

    return null;
  }, [t]);

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText || selectedText.length < 2 || selectedText.length > 50) {
      setTooltip((prev) => ({ ...prev, visible: false }));
      return;
    }

    // Get the position of the selection
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();

    if (!rect || !containerRef.current) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top - 10;

    // Look up the word in glossary
    const result = findGlossaryTerm(selectedText);

    setTooltip({
      visible: true,
      x,
      y,
      word: selectedText,
      definition: result?.definition || null,
      termId: result?.termId || null,
    });
  }, [findGlossaryTerm]);

  // Close tooltip on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close tooltip on scroll
  useEffect(() => {
    const handleScroll = () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* The selectable text */}
      <div
        onMouseUp={handleMouseUp}
        className="select-text cursor-text"
      >
        {children}
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className={cn(
            'absolute z-50 max-w-xs transform -translate-x-1/2',
            'animate-in fade-in slide-in-from-bottom-2 duration-150'
          )}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div
            className={cn(
              'rounded-lg shadow-lg border p-3',
              tooltip.definition
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            )}
          >
            {/* Word being looked up */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {tooltip.definition ? '📖' : '🔍'}
              </span>
              <span className="font-semibold text-gray-900">
                &quot;{tooltip.word}&quot;
              </span>
            </div>

            {/* Definition or not found message */}
            {tooltip.definition ? (
              <p className="text-sm text-green-800 leading-snug">
                {tooltip.definition}
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                {t('glossary.notInWordBank')}
              </p>
            )}

            {/* Hint to add to word bank */}
            {tooltip.definition && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <span>✨</span>
                {t('glossary.foundInWordBank')}
              </p>
            )}
          </div>

          {/* Arrow pointing down */}
          <div
            className={cn(
              'w-3 h-3 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1.5',
              tooltip.definition
                ? 'bg-green-50 border-r border-b border-green-200'
                : 'bg-gray-50 border-r border-b border-gray-200'
            )}
          />
        </div>
      )}
    </div>
  );
}

export default SelectableText;
