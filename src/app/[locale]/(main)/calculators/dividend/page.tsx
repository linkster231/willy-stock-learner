/**
 * Dividend Yield Calculator Page
 *
 * Calculate dividend income from stocks.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid } from '@/components/calculators';
import { NumberInput } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { calculateDividend, type DividendFrequency } from '@/lib/calculators';

export default function DividendPage() {
  const t = useTranslations('calculators.dividend');

  // Form state
  const [stockPrice, setStockPrice] = useState<number>(100);
  const [dividendPerShare, setDividendPerShare] = useState<number>(0.5);
  const [frequency, setFrequency] = useState<DividendFrequency>('quarterly');
  const [numberOfShares, setNumberOfShares] = useState<number>(100);

  // Calculate results
  const result = useMemo(() => {
    if (stockPrice <= 0 || dividendPerShare < 0 || numberOfShares < 0) {
      return null;
    }
    try {
      return calculateDividend({
        stockPrice,
        dividendPerShare,
        frequency,
        numberOfShares,
      });
    } catch {
      return null;
    }
  }, [stockPrice, dividendPerShare, frequency, numberOfShares]);

  const handleReset = () => {
    setStockPrice(100);
    setDividendPerShare(0.5);
    setFrequency('quarterly');
    setNumberOfShares(100);
  };

  return (
    <CalculatorShell
      titleKey="dividend"
      descriptionKey="dividend"
      showResults={result !== null}
      onReset={handleReset}
      results={
        result && (
          <ResultGrid columns={2}>
            <ResultCard
              label={t('annualYield')}
              value={result.annualYield * 100}
              format="percent"
              size="lg"
              variant="positive"
            />
            <ResultCard
              label={t('annualIncome')}
              value={result.annualIncome}
              format="currency"
              size="lg"
              variant="positive"
            />
            <ResultCard
              label={t('monthlyIncome')}
              value={result.monthlyIncome}
              format="currency"
            />
          </ResultGrid>
        )
      }
      explanation={
        <div className="space-y-3">
          <p>
            Dividend yield tells you what percentage of the stock price you&apos;ll
            receive in dividends each year.
          </p>
          <div className="rounded-lg bg-green-50 p-3">
            <p className="text-sm font-medium text-green-800">
              Dividend Yield = Annual Dividend ÷ Stock Price
            </p>
          </div>
          <p className="text-sm">
            Companies typically pay dividends quarterly (4 times per year).
            High-yield stocks pay 4%+ but may be riskier. Dividend aristocrats
            (like Coca-Cola, Johnson & Johnson) have raised dividends for 25+
            consecutive years.
          </p>
        </div>
      }
    >
      <NumberInput
        label={t('stockPrice')}
        value={stockPrice}
        onChange={setStockPrice}
        min={0.01}
        step={1}
        leftAddon="$"
      />
      <NumberInput
        label={t('dividendPerShare')}
        value={dividendPerShare}
        onChange={setDividendPerShare}
        min={0}
        step={0.01}
        leftAddon="$"
      />
      <Select
        label={t('dividendFrequency')}
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as DividendFrequency)}
        options={[
          { value: 'monthly', label: t('monthly') },
          { value: 'quarterly', label: t('quarterly') },
          { value: 'annually', label: t('annually') },
        ]}
      />
      <NumberInput
        label={t('numberOfShares')}
        value={numberOfShares}
        onChange={setNumberOfShares}
        min={0}
        step={10}
      />
    </CalculatorShell>
  );
}
