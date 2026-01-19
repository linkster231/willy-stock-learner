/**
 * Future Value Calculator Page
 *
 * Project how much an investment will be worth.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid, GrowthChart } from '@/components/calculators';
import { NumberInput } from '@/components/ui/Input';
import { calculateFutureValue, calculateRequiredContribution } from '@/lib/calculators';
import { formatCurrency } from '@/lib/utils';

export default function FutureValuePage() {
  const t = useTranslations('calculators.futureValue');

  // Form state
  const [currentInvestment, setCurrentInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualReturn, setAnnualReturn] = useState<number>(8);
  const [years, setYears] = useState<number>(20);

  // Calculate results
  const result = useMemo(() => {
    if (
      currentInvestment < 0 ||
      monthlyContribution < 0 ||
      annualReturn < 0 ||
      years <= 0
    ) {
      return null;
    }
    try {
      return calculateFutureValue({
        currentInvestment,
        monthlyContribution,
        annualReturn,
        years,
      });
    } catch {
      return null;
    }
  }, [currentInvestment, monthlyContribution, annualReturn, years]);

  // Calculate what's needed for $1M
  const millionPlan = useMemo(() => {
    if (currentInvestment < 0 || annualReturn < 0 || years <= 0) {
      return null;
    }
    try {
      return calculateRequiredContribution(1000000, currentInvestment, annualReturn, years);
    } catch {
      return null;
    }
  }, [currentInvestment, annualReturn, years]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!result) return [];
    return result.yearlyProjections.map((item) => ({
      label: `Year ${item.year}`,
      value: item.endBalance,
      secondaryValue: item.startBalance + item.contributions,
    }));
  }, [result]);

  const handleReset = () => {
    setCurrentInvestment(10000);
    setMonthlyContribution(500);
    setAnnualReturn(8);
    setYears(20);
  };

  return (
    <CalculatorShell
      titleKey="futureValue"
      descriptionKey="futureValue"
      showResults={result !== null}
      onReset={handleReset}
      results={
        result && (
          <ResultGrid columns={2}>
            <ResultCard
              label={t('futureValue')}
              value={result.futureValue}
              format="currency"
              size="lg"
              variant="positive"
            />
            <ResultCard
              label={t('totalGain')}
              value={result.totalInterest}
              format="currency"
              variant="positive"
            />
            <ResultCard
              label="Total Contributed"
              value={result.totalContributions}
              format="currency"
              variant="default"
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
          <p>
            See how your investments can grow over time with compound returns and
            regular contributions.
          </p>

          {/* Million dollar goal */}
          {millionPlan !== null && (
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-sm font-medium text-green-800">
                💰 Path to $1,000,000:
              </p>
              <p className="mt-1 text-sm text-green-700">
                {millionPlan === 0 ? (
                  `Your current investment alone will exceed $1M in ${years} years!`
                ) : (
                  `Invest ${formatCurrency(millionPlan)}/month to reach $1M in ${years} years at ${annualReturn}% return.`
                )}
              </p>
            </div>
          )}

          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm font-medium text-blue-800">Key Factors:</p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700">
              <li>• <strong>Time:</strong> The longer you invest, the more compound growth helps</li>
              <li>• <strong>Rate:</strong> Small differences in return compound significantly</li>
              <li>• <strong>Contributions:</strong> Regular investing accelerates growth</li>
            </ul>
          </div>
        </div>
      }
    >
      <NumberInput
        label={t('currentInvestment')}
        value={currentInvestment}
        onChange={setCurrentInvestment}
        min={0}
        step={1000}
        leftAddon="$"
      />
      <NumberInput
        label="Monthly Contribution"
        value={monthlyContribution}
        onChange={setMonthlyContribution}
        min={0}
        step={50}
        leftAddon="$"
        helpText="Amount you'll add each month"
      />
      <NumberInput
        label={t('annualReturn')}
        value={annualReturn}
        onChange={setAnnualReturn}
        min={0}
        max={30}
        step={0.5}
        rightAddon="%"
        helpText="8-10% is typical for stock market"
      />
      <NumberInput
        label={t('investmentYears')}
        value={years}
        onChange={setYears}
        min={1}
        max={50}
        step={1}
      />
    </CalculatorShell>
  );
}
