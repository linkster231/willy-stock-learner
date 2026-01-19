/**
 * Profit/Loss Calculator Page
 *
 * Calculate gains or losses from stock trades including commissions.
 */

'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { CalculatorShell, ResultCard, ResultGrid } from '@/components/calculators';
import { NumberInput } from '@/components/ui/Input';
import { calculateProfitLoss } from '@/lib/calculators';

export default function ProfitLossPage() {
  const t = useTranslations('calculators.profitLoss');

  // Form state
  const [buyPrice, setBuyPrice] = useState<number>(50);
  const [sellPrice, setSellPrice] = useState<number>(65);
  const [shares, setShares] = useState<number>(100);
  const [buyCommission, setBuyCommission] = useState<number>(0);
  const [sellCommission, setSellCommission] = useState<number>(0);

  // Calculate results
  const result = useMemo(() => {
    if (buyPrice <= 0 || sellPrice < 0 || shares <= 0) {
      return null;
    }
    try {
      return calculateProfitLoss({
        buyPrice,
        sellPrice,
        shares,
        buyCommission,
        sellCommission,
      });
    } catch {
      return null;
    }
  }, [buyPrice, sellPrice, shares, buyCommission, sellCommission]);

  const handleReset = () => {
    setBuyPrice(50);
    setSellPrice(65);
    setShares(100);
    setBuyCommission(0);
    setSellCommission(0);
  };

  return (
    <CalculatorShell
      titleKey="profitLoss"
      descriptionKey="profitLoss"
      showResults={result !== null}
      onReset={handleReset}
      results={
        result && (
          <ResultGrid columns={2}>
            <ResultCard
              label={t('totalProfit')}
              value={result.netProfit}
              format="currency"
              size="lg"
              variant={result.netProfit >= 0 ? 'positive' : 'negative'}
            />
            <ResultCard
              label={t('percentGain')}
              value={result.percentGain}
              format="percent"
              variant={result.percentGain >= 0 ? 'positive' : 'negative'}
            />
            <ResultCard
              label={t('breakEven')}
              value={result.breakEvenPrice}
              format="currency"
              variant="default"
            />
          </ResultGrid>
        )
      }
      explanation={
        <div className="space-y-3">
          <p>
            This calculator helps you understand your actual profit or loss from
            a stock trade after accounting for commissions.
          </p>
          <div className="rounded-lg bg-yellow-50 p-3">
            <p className="text-sm font-medium text-yellow-800">
              Important: Many brokers now offer commission-free trading.
            </p>
            <p className="mt-1 text-sm text-yellow-600">
              If your broker charges fees, don&apos;t forget to include them!
            </p>
          </div>
        </div>
      }
    >
      <NumberInput
        label={t('buyPrice')}
        value={buyPrice}
        onChange={setBuyPrice}
        min={0.01}
        step={0.01}
        leftAddon="$"
      />
      <NumberInput
        label={t('sellPrice')}
        value={sellPrice}
        onChange={setSellPrice}
        min={0}
        step={0.01}
        leftAddon="$"
      />
      <NumberInput
        label={t('shares')}
        value={shares}
        onChange={setShares}
        min={1}
        step={1}
      />
      <NumberInput
        label={t('buyCommission')}
        value={buyCommission}
        onChange={setBuyCommission}
        min={0}
        step={1}
        leftAddon="$"
      />
      <NumberInput
        label={t('sellCommission')}
        value={sellCommission}
        onChange={setSellCommission}
        min={0}
        step={1}
        leftAddon="$"
      />
    </CalculatorShell>
  );
}
