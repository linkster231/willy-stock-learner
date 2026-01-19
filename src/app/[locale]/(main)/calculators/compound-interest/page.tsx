/**
 * Compound Interest Calculator Page
 *
 * Interactive calculator showing how money grows with compound interest.
 * Includes visualization of growth over time.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid, GrowthChart, PresetManager } from '@/components/calculators';
import { Input, NumberInput } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { calculateCompoundInterest, type CompoundInterestInput } from '@/lib/calculators';
import { formatCurrency, formatPercent } from '@/lib/utils';

/**
 * Compounding frequency options
 */
const FREQUENCY_OPTIONS = [
  { value: '1', labelKey: 'annually' },
  { value: '2', labelKey: 'semiannually' },
  { value: '4', labelKey: 'quarterly' },
  { value: '12', labelKey: 'monthly' },
  { value: '365', labelKey: 'daily' },
];

export default function CompoundInterestPage() {
  const t = useTranslations('calculators.compoundInterest');
  const commonT = useTranslations('calculators');

  // Form state
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(20);
  const [frequency, setFrequency] = useState<string>('12');

  // Calculate results whenever inputs change
  const result = useMemo(() => {
    if (principal <= 0 || rate <= 0 || years <= 0) {
      return null;
    }

    try {
      const input: CompoundInterestInput = {
        principal,
        annualRate: rate / 100, // Convert percentage to decimal
        years,
        compoundingFrequency: parseInt(frequency, 10),
      };
      return calculateCompoundInterest(input);
    } catch {
      return null;
    }
  }, [principal, rate, years, frequency]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!result) return [];
    return result.yearlyBreakdown.map((item) => ({
      label: `Year ${item.year}`,
      value: item.balance,
      secondaryValue: principal, // Show principal as baseline
    }));
  }, [result, principal]);

  // Reset to defaults
  const handleReset = () => {
    setPrincipal(10000);
    setRate(8);
    setYears(20);
    setFrequency('12');
  };

  // Current values for preset saving
  const currentValues = useMemo(
    () => ({ principal, rate, years, frequency }),
    [principal, rate, years, frequency]
  );

  // Load preset values
  const handleLoadPreset = useCallback((values: Record<string, number | string>) => {
    if (values.principal !== undefined) setPrincipal(Number(values.principal));
    if (values.rate !== undefined) setRate(Number(values.rate));
    if (values.years !== undefined) setYears(Number(values.years));
    if (values.frequency !== undefined) setFrequency(String(values.frequency));
  }, []);

  return (
    <CalculatorShell
      titleKey="compoundInterest"
      descriptionKey="compoundInterest"
      showResults={result !== null}
      onReset={handleReset}
      presetManager={
        <PresetManager
          calculatorType="compound-interest"
          currentValues={currentValues}
          onLoadPreset={handleLoadPreset}
        />
      }
      results={
        result && (
          <ResultGrid columns={2}>
            <ResultCard
              label={t('finalAmount')}
              value={result.finalAmount}
              format="currency"
              size="lg"
              variant="positive"
            />
            <ResultCard
              label={t('totalInterest')}
              value={result.totalInterest}
              format="currency"
              variant="positive"
            />
          </ResultGrid>
        )
      }
      chart={
        result && (
          <GrowthChart
            data={chartData}
            primaryLabel={t('finalAmount')}
            secondaryLabel={t('principal')}
            formatAsCurrency
            height={280}
          />
        )
      }
      explanation={
        <div className="space-y-3">
          <p className="font-mono text-xs text-gray-500">{t('formula')}</p>
          <p>{t('formulaExplain')}</p>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">
              Example: ${principal.toLocaleString()} at {rate}% for {years} years
            </p>
            {result && (
              <p className="mt-1 text-sm text-blue-600">
                Your money would grow to {formatCurrency(result.finalAmount)}, earning{' '}
                {formatCurrency(result.totalInterest)} in interest!
              </p>
            )}
          </div>
        </div>
      }
    >
      {/* Principal Input */}
      <NumberInput
        label={t('principal')}
        value={principal}
        onChange={setPrincipal}
        min={0}
        step={1000}
        helpText={t('principalHelp')}
        leftAddon="$"
      />

      {/* Annual Rate Input */}
      <NumberInput
        label={t('rate')}
        value={rate}
        onChange={setRate}
        min={0}
        max={100}
        step={0.5}
        helpText={t('rateHelp')}
        rightAddon="%"
      />

      {/* Years Input */}
      <NumberInput
        label={t('years')}
        value={years}
        onChange={setYears}
        min={1}
        max={50}
        step={1}
        helpText={t('yearsHelp')}
      />

      {/* Compounding Frequency */}
      <Select
        label={t('frequency')}
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        options={FREQUENCY_OPTIONS.map((opt) => ({
          value: opt.value,
          label: t(`frequencyOptions.${opt.labelKey}`),
        }))}
      />
    </CalculatorShell>
  );
}
