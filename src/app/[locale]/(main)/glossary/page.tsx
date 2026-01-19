/**
 * Glossary Page
 *
 * Browse and search financial terms.
 * Add words to personal list for spaced repetition review.
 * Definitions are expanded by default for easy reading.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { glossaryTerms, getTermById } from '@/content/glossary/terms';

const CATEGORIES = ['basics', 'trading', 'analysis', 'psychology', 'tax'] as const;
const DEFINITION_MAX_LENGTH = 150;

export default function GlossaryPage() {
  const t = useTranslations('glossary');
  const tTerms = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [myWords, setMyWords] = useState<Set<string>>(new Set());
  // Track collapsed terms - expanded by default (empty set means all expanded)
  const [collapsedTerms, setCollapsedTerms] = useState<Set<string>>(new Set());
  // Track which long definitions are fully expanded (for "read more" feature)
  const [fullyExpandedDefs, setFullyExpandedDefs] = useState<Set<string>>(new Set());

  // Filter terms based on search and category
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      // Get the translated term name for search
      const termName = tTerms(term.termKey);
      const matchesSearch =
        searchQuery === '' ||
        termName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === null || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, tTerms]);

  // Toggle word in my list
  const toggleMyWord = (termId: string) => {
    setMyWords((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  // Toggle term expansion (collapsed state)
  const toggleExpanded = (termId: string) => {
    setCollapsedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  // Check if a term is expanded (not in collapsed set)
  const isExpanded = (termId: string) => !collapsedTerms.has(termId);

  // Toggle full definition expansion for "read more"
  const toggleFullDefinition = (termId: string) => {
    setFullyExpandedDefs((prev) => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  // Check if definition is fully expanded
  const isFullyExpanded = (termId: string) => fullyExpandedDefs.has(termId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/glossary/my-words">
          <Button variant="secondary">
            📚 {t('myWords')} ({myWords.size})
          </Button>
        </Link>
        {myWords.size > 0 && (
          <Link href="/glossary/review">
            <Button>🎴 {t('reviewMode')}</Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder={t('searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftAddon="🔍"
        />
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors',
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Terms List */}
      {filteredTerms.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">{t('noResults')}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTerms.map((term) => {
            const expanded = isExpanded(term.id);
            const relatedTermObjects = term.relatedTerms
              ?.map((id) => getTermById(id))
              .filter(Boolean);

            return (
              <Card
                key={term.id}
                id={`term-${term.id}`}
                className="transition-shadow hover:shadow-md"
              >
                <div className="p-4">
                  {/* Header row with term name, category, and actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleExpanded(term.id)}
                      className="flex flex-1 items-center gap-2 text-left"
                    >
                      <span className="text-gray-400 transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                        ▶
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        {tTerms(term.termKey)}
                      </h3>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize text-gray-600">
                        {term.category}
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMyWord(term.id);
                      }}
                      className={cn(
                        'ml-4 rounded-lg p-2 transition-colors',
                        myWords.has(term.id)
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      )}
                      title={myWords.has(term.id) ? t('removeFromList') : t('addToList')}
                    >
                      {myWords.has(term.id) ? '★' : '☆'}
                    </button>
                  </div>

                  {/* Expanded content - shown by default */}
                  {expanded && (
                    <div className="mt-3 pl-6">
                      {/* Definition with read more for long text */}
                      {(() => {
                        const definition = tTerms(term.definitionKey);
                        const isLong = definition.length > DEFINITION_MAX_LENGTH;
                        const showFull = isFullyExpanded(term.id);
                        const displayText = isLong && !showFull
                          ? definition.slice(0, DEFINITION_MAX_LENGTH) + '...'
                          : definition;

                        return (
                          <p className="text-sm text-gray-700">
                            {displayText}
                            {isLong && (
                              <button
                                onClick={() => toggleFullDefinition(term.id)}
                                className="ml-1 text-blue-600 hover:underline text-sm font-medium"
                              >
                                {showFull ? t('showLess') : t('readMore')}
                              </button>
                            )}
                          </p>
                        );
                      })()}

                      {/* Example */}
                      {term.example && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3">
                          <p className="text-xs font-medium text-blue-800">Example:</p>
                          <p className="mt-1 text-sm text-blue-700">
                            {tTerms(term.example)}
                          </p>
                        </div>
                      )}

                      {/* Related Terms */}
                      {relatedTermObjects && relatedTermObjects.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500">Related terms:</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {relatedTermObjects.map((relatedTerm) => (
                              <button
                                key={relatedTerm!.id}
                                onClick={() => {
                                  setSearchQuery('');
                                  setSelectedCategory(null);
                                  // Scroll to the related term
                                  const element = document.getElementById(`term-${relatedTerm!.id}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    // Make sure it's expanded
                                    setCollapsedTerms((prev) => {
                                      const next = new Set(prev);
                                      next.delete(relatedTerm!.id);
                                      return next;
                                    });
                                  }
                                }}
                                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 transition-colors"
                              >
                                {tTerms(relatedTerm!.termKey)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
