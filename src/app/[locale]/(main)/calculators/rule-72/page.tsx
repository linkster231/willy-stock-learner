/**
 * Rule of 72 Calculator Page
 *
 * Quick mental math to estimate doubling time.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid, GrowthChart } from '@/components/calculators';
import { NumberInput } from '@/components/ui/Input';
import { calculateRule72, compareReturns } from '@/lib/calculators';

export default function Rule72Page() {
  const t = useTranslations('calculators.rule72');

  // Form state
  const [annualReturn, setAnnualReturn] = useState<number>(8);

  // Calculate results
  const result = useMemo(() => {
    if (annualReturn <= 0 || annualReturn > 100) {
      return null;
    }
    try {
      return calculateRule72({ annualReturn });
    } catch {
      return null;
    }
  }, [annualReturn]);

  // Compare different return rates
  const comparison = useMemo(() => {
    return compareReturns([4, 6, 8, 10, 12], 10000, 30);
  }, []);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!result) return [];
    return result.doublingSchedule.map((item) => ({
      label: `Year ${item.years}`,
      value: item.value,
    }));
  }, [result]);

  const handleReset = () => {
    setAnnualReturn(8);
  };

  return (
    <CalculatorShell
      titleKey="rule72"
      descriptionKey="rule72"
      showResults={result !== null}
      onReset={handleReset}
      results={
        result && (
          <ResultGrid columns={1}>
            <ResultCard
              label={t('yearsToDouble')}
              value={result.yearsToDouble}
              format="years"
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
            primaryLabel="Investment Value"
            formatAsCurrency
            height={280}
            type="line"
          />
        )
      }
      explanation={
        <div className="space-y-3">
          <p>{t('explanation')}</p>
          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">
              Formula: Years to Double = 72 ÷ Annual Return %
            </p>
          </div>

          {/* Comparison table */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">
              $10,000 invested for 30 years at different rates:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Return</th>
                    <th className="py-2 text-right">Years to 2x</th>
                    <th className="py-2 text-right">Final Value</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr
                      key={row.returnRate}
                      className={`border-b ${
                        row.returnRate === annualReturn
                          ? 'bg-blue-50 font-medium'
                          : ''
                      }`}
                    >
                      <td className="py-2">{row.returnRate}%</td>
                      <td className="py-2 text-right">
                        {row.yearsToDouble.toFixed(1)} yrs
                      </td>
                      <td className="py-2 text-right">
                        ${row.finalValue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    >
      <NumberInput
        label={t('interestRate')}
        value={annualReturn}
        onChange={setAnnualReturn}
        min={1}
        max={50}
        step={0.5}
        rightAddon="%"
        helpText="Historical stock market average is about 10%"
      />
    </CalculatorShell>
  );
}
