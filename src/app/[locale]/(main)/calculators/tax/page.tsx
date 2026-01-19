/**
 * Tax Calculator Page (New Jersey)
 *
 * Calculate federal and NJ state taxes on investment gains.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid } from '@/components/calculators';
import { NumberInput } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { calculateInvestmentTax, type FilingStatus, type HoldingPeriod } from '@/lib/calculators';
import { formatPercent } from '@/lib/utils';

export default function TaxPage() {
  const t = useTranslations('calculators.tax');

  // Form state
  const [capitalGain, setCapitalGain] = useState<number>(10000);
  const [totalIncome, setTotalIncome] = useState<number>(80000);
  const [holdingPeriod, setHoldingPeriod] = useState<HoldingPeriod>('long');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');

  // Calculate results
  const result = useMemo(() => {
    if (capitalGain <= 0 || totalIncome < capitalGain) {
      return null;
    }
    try {
      return calculateInvestmentTax({
        capitalGain,
        totalIncome,
        holdingPeriod,
        filingStatus,
      });
    } catch {
      return null;
    }
  }, [capitalGain, totalIncome, holdingPeriod, filingStatus]);

  const handleReset = () => {
    setCapitalGain(10000);
    setTotalIncome(80000);
    setHoldingPeriod('long');
    setFilingStatus('single');
  };

  return (
    <CalculatorShell
      titleKey="tax"
      descriptionKey="tax"
      showResults={result !== null}
      onReset={handleReset}
      results={
        result && (
          <ResultGrid columns={2}>
            <ResultCard
              label={t('federalTax')}
              value={result.federalTax}
              format="currency"
              variant="negative"
            />
            <ResultCard
              label={t('stateTax')}
              value={result.stateTax}
              format="currency"
              variant="negative"
            />
            <ResultCard
              label={t('totalTax')}
              value={result.totalTax}
              format="currency"
              size="lg"
              variant="negative"
            />
            <ResultCard
              label={t('netProfit')}
              value={result.netProfit}
              format="currency"
              size="lg"
              variant="positive"
            />
          </ResultGrid>
        )
      }
      explanation={
        <div className="space-y-3">
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">{t('njNote')}</p>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Short-term gains:</strong> Held 1 year or less, taxed as
              ordinary income (higher rates).
            </p>
            <p>
              <strong>Long-term gains:</strong> Held more than 1 year, get
              preferential federal rates (0%, 15%, or 20%).
            </p>
          </div>
          {result && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Your effective tax rate on this gain:{' '}
                <strong>{formatPercent(result.effectiveRate)}</strong>
              </p>
            </div>
          )}
        </div>
      }
    >
      <NumberInput
        label={t('capitalGain')}
        value={capitalGain}
        onChange={setCapitalGain}
        min={0}
        step={1000}
        leftAddon="$"
      />
      <NumberInput
        label={t('totalIncome')}
        value={totalIncome}
        onChange={setTotalIncome}
        min={capitalGain}
        step={5000}
        leftAddon="$"
      />
      <Select
        label={t('holdingPeriod')}
        value={holdingPeriod}
        onChange={(e) => setHoldingPeriod(e.target.value as HoldingPeriod)}
        options={[
          { value: 'short', label: t('shortTerm') },
          { value: 'long', label: t('longTerm') },
        ]}
      />
      <Select
        label={t('filingStatus')}
        value={filingStatus}
        onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
        options={[
          { value: 'single', label: t('single') },
          { value: 'married', label: t('married') },
        ]}
      />
    </CalculatorShell>
  );
}
