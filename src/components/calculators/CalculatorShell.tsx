/**
 * Calculator Shell Component
 *
 * Shared layout for all calculator pages.
 * Provides consistent structure with inputs, results, and chart sections.
 */

'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CalculatorShellProps {
  /** Calculator title key (from translations) */
  titleKey: string;
  /** Calculator description key (from translations) */
  descriptionKey: string;
  /** Input form content */
  children: ReactNode;
  /** Results section (shown after calculation) */
  results?: ReactNode;
  /** Optional chart/visualization */
  chart?: ReactNode;
  /** How it works explanation */
  explanation?: ReactNode;
  /** Optional preset manager component */
  presetManager?: ReactNode;
  /** Whether to show results section */
  showResults?: boolean;
  /** Calculate button handler */
  onCalculate?: () => void;
  /** Reset button handler */
  onReset?: () => void;
  /** Whether calculate button is disabled */
  calculateDisabled?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Shell component that wraps all calculator pages.
 * Provides consistent layout and styling.
 */
export function CalculatorShell({
  titleKey,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  descriptionKey,
  children,
  results,
  chart,
  explanation,
  presetManager,
  showResults = false,
  onCalculate,
  onReset,
  calculateDisabled = false,
  className,
}: CalculatorShellProps) {
  const t = useTranslations('calculators');

  return (
    <div className={cn('mx-auto max-w-4xl px-4 py-6 sm:px-6', className)}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t(`${titleKey}.title`)}
          </h1>
          <p className="mt-2 text-gray-600">{t(`${titleKey}.description`)}</p>
        </div>
        {presetManager && <div className="flex-shrink-0">{presetManager}</div>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('inputs')}</CardTitle>
            </CardHeader>
            <div className="p-6 pt-0">
              <div className="space-y-4">{children}</div>

              {/* Action Buttons */}
              {(onCalculate || onReset) && (
                <div className="mt-6 flex gap-3">
                  {onCalculate && (
                    <Button
                      onClick={onCalculate}
                      disabled={calculateDisabled}
                      className="flex-1"
                    >
                      {t('calculate')}
                    </Button>
                  )}
                  {onReset && (
                    <Button variant="secondary" onClick={onReset}>
                      {t('reset')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* How It Works (mobile: after inputs) */}
          {explanation && (
            <Card className="lg:hidden">
              <CardHeader>
                <CardTitle>{t('howItWorks')}</CardTitle>
              </CardHeader>
              <div className="p-6 pt-0 text-sm text-gray-600">{explanation}</div>
            </Card>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {showResults && results && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">{t('results')}</CardTitle>
              </CardHeader>
              <div className="p-6 pt-0">{results}</div>
            </Card>
          )}

          {/* Chart */}
          {showResults && chart && (
            <Card>
              <CardHeader>
                <CardTitle>{t('visualization')}</CardTitle>
              </CardHeader>
              <div className="p-6 pt-0">{chart}</div>
            </Card>
          )}

          {/* How It Works (desktop: in right column) */}
          {explanation && (
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle>{t('howItWorks')}</CardTitle>
              </CardHeader>
              <div className="p-6 pt-0 text-sm text-gray-600">{explanation}</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
