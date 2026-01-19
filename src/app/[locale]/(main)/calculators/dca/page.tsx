/**
 * Dollar-Cost Averaging Calculator Page
 *
 * Show how regular investing smooths out price volatility.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid, GrowthChart } from '@/components/calculators';
import { NumberInput } from '@/components/ui/Input';
import { calculateDCA } from '@/lib/calculators';

export default function DCAPage() {
  const t = useTranslations('calculators.dca');

  // Form state
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(500);
  const [months, setMonths] = useState<number>(24);
  const [averagePrice, setAveragePrice] = useState<number>(100);

  // Calculate results
  const result = useMemo(() => {
    if (monthlyInvestment <= 0 || months <= 0 || averagePrice <= 0) {
      return null;
    }
    try {
      return calculateDCA({
        monthlyInvestment,
        months,
        averagePrice,
        priceVolatility: 0.15, // 15% volatility simulation
      });
    } catch {
      return null;
    }
  }, [monthlyInvestment, months, averagePrice]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!result) return [];
    return result.monthlyBreakdown.map((item) => ({
      label: `Month ${item.month}`,
      value: item.currentValue,
      secondaryValue: item.totalInvested,
    }));
  }, [result]);

  const handleReset = () => {
    setMonthlyInvestment(500);
    setMonths(24);
    setAveragePrice(100);
  };

  return (
    <CalculatorShell
      titleKey="dca"
      descriptionKey="dca"
      showResults={result !== null}
      onReset={handleReset}
      results={
        result && (
          <ResultGrid columns={2}>
            <ResultCard
              label={t('totalInvested')}
              value={result.totalInvested}
              format="currency"
              variant="default"
            />
            <ResultCard
              label={t('totalShares')}
              value={result.totalShares}
              format="shares"
              variant="default"
            />
            <ResultCard
              label={t('averageCost')}
              value={result.averageCostPerShare}
              format="currency"
              size="lg"
              variant="positive"
            />
          </ResultGrid>
        )
      }
      chart={
        result && (
          <GrowthChart
            data={chartData}
            primaryLabel="Portfolio Value"
            secondaryLabel="Amount Invested"
            formatAsCurrency
            height={280}
          />
        )
      }
      explanation={
        <div className="space-y-3">
          <p>{t('explanation')}</p>
          <div className="rounded-lg bg-purple-50 p-3">
            <p className="text-sm font-medium text-purple-800">
              Why DCA works:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-purple-700">
              <li>• Removes the stress of timing the market</li>
              <li>• Buys more shares when prices drop</li>
              <li>• Builds consistent investing habits</li>
              <li>• Works great with automatic contributions</li>
            </ul>
          </div>
        </div>
      }
    >
      <NumberInput
        label={t('monthlyInvestment')}
        value={monthlyInvestment}
        onChange={setMonthlyInvestment}
        min={1}
        step={50}
        leftAddon="$"
      />
      <NumberInput
        label={t('months')}
        value={months}
        onChange={setMonths}
        min={2}
        max={120}
        step={1}
      />
      <NumberInput
        label="Average Stock Price"
        value={averagePrice}
        onChange={setAveragePrice}
        min={1}
        step={10}
        leftAddon="$"
        helpText="Estimated average price over the investment period"
      />
    </CalculatorShell>
  );
}
