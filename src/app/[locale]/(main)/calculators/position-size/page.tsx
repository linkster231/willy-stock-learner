/**
 * Position Size Calculator Page
 *
 * Calculate how much to invest based on risk tolerance.
 * Critical for protecting capital.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid } from '@/components/calculators';
import { NumberInput } from '@/components/ui/Input';
import { calculatePositionSize, calculateRiskReward } from '@/lib/calculators';

export default function PositionSizePage() {
  const t = useTranslations('calculators.positionSize');

  // Form state
  const [accountBalance, setAccountBalance] = useState<number>(50000);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<number>(100);
  const [stopLossPrice, setStopLossPrice] = useState<number>(95);
  const [targetPrice, setTargetPrice] = useState<number>(115);

  // Calculate results
  const result = useMemo(() => {
    if (
      accountBalance <= 0 ||
      riskPercent <= 0 ||
      entryPrice <= 0 ||
      stopLossPrice <= 0 ||
      stopLossPrice >= entryPrice
    ) {
      return null;
    }
    try {
      return calculatePositionSize({
        accountBalance,
        riskPercent,
        entryPrice,
        stopLossPrice,
      });
    } catch {
      return null;
    }
  }, [accountBalance, riskPercent, entryPrice, stopLossPrice]);

  // Calculate risk/reward
  const riskReward = useMemo(() => {
    if (stopLossPrice >= entryPrice || targetPrice <= entryPrice) {
      return null;
    }
    try {
      return calculateRiskReward(entryPrice, stopLossPrice, targetPrice);
    } catch {
      return null;
    }
  }, [entryPrice, stopLossPrice, targetPrice]);

  const handleReset = () => {
    setAccountBalance(50000);
    setRiskPercent(2);
    setEntryPrice(100);
    setStopLossPrice(95);
    setTargetPrice(115);
  };

  return (
    <CalculatorShell
      titleKey="positionSize"
      descriptionKey="positionSize"
      showResults={result !== null}
      onReset={handleReset}
      results={
        result && (
          <ResultGrid columns={2}>
            <ResultCard
              label={t('positionSize')}
              value={result.sharesCount}
              format="shares"
              size="lg"
              variant="positive"
            />
            <ResultCard
              label={t('dollarAmount')}
              value={result.totalInvestment}
              format="currency"
              size="lg"
            />
            <ResultCard
              label={t('maxLoss')}
              value={result.potentialLoss}
              format="currency"
              variant="negative"
            />
            {riskReward && (
              <ResultCard
                label="Risk/Reward Ratio"
                value={riskReward.ratio}
                format="number"
                variant={riskReward.isGoodRatio ? 'positive' : 'negative'}
              />
            )}
          </ResultGrid>
        )
      }
      explanation={
        <div className="space-y-3">
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">
              Golden Rule: Never risk more than 1-2% of your account on a single
              trade!
            </p>
          </div>
          <p className="text-sm">{t('riskHelp')}</p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Stop Loss:</strong> {t('stopLossHelp')}
            </p>
            <p>
              <strong>Risk/Reward:</strong> Aim for at least 2:1 ratio (potential
              gain should be 2x potential loss).
            </p>
          </div>
          {riskReward && (
            <div
              className={`rounded-lg p-3 ${
                riskReward.isGoodRatio
                  ? 'bg-green-50 text-green-800'
                  : 'bg-yellow-50 text-yellow-800'
              }`}
            >
              <p className="text-sm font-medium">
                {riskReward.isGoodRatio
                  ? `✓ Good ratio! You could gain $${riskReward.rewardPerShare}/share for risking $${riskReward.riskPerShare}/share`
                  : `⚠ Consider a better entry or target. Risk $${riskReward.riskPerShare} to gain $${riskReward.rewardPerShare} is not ideal.`}
              </p>
            </div>
          )}
        </div>
      }
    >
      <NumberInput
        label={t('accountBalance')}
        value={accountBalance}
        onChange={setAccountBalance}
        min={100}
        step={1000}
        leftAddon="$"
      />
      <NumberInput
        label={t('riskPercent')}
        value={riskPercent}
        onChange={setRiskPercent}
        min={0.1}
        max={10}
        step={0.5}
        rightAddon="%"
        helpText={t('riskHelp')}
      />
      <NumberInput
        label={t('entryPrice')}
        value={entryPrice}
        onChange={setEntryPrice}
        min={0.01}
        step={1}
        leftAddon="$"
      />
      <NumberInput
        label={t('stopLoss')}
        value={stopLossPrice}
        onChange={setStopLossPrice}
        min={0.01}
        max={entryPrice - 0.01}
        step={0.5}
        leftAddon="$"
        helpText={t('stopLossHelp')}
      />
      <NumberInput
        label="Target Price (optional)"
        value={targetPrice}
        onChange={setTargetPrice}
        min={entryPrice + 0.01}
        step={1}
        leftAddon="$"
        helpText="Price where you plan to take profits"
      />
    </CalculatorShell>
  );
}
