/**
 * Investment Tax Calculator (New Jersey)
 *
 * Calculates federal and NJ state taxes on capital gains.
 *
 * Key NJ Tax Facts:
 * - NJ taxes ALL capital gains as regular income (no special rate for long-term)
 * - Federal taxes have different rates for short-term vs long-term gains
 * - NJ has a progressive tax rate from 1.4% to 10.75%
 *
 * 2024 Federal Long-Term Capital Gains Tax Rates:
 * - 0% for income up to $44,625 (single) / $89,250 (married)
 * - 15% for income up to $492,300 (single) / $553,850 (married)
 * - 20% for income above those thresholds
 *
 * Short-term federal gains are taxed as ordinary income.
 */

export type FilingStatus = 'single' | 'married';
export type HoldingPeriod = 'short' | 'long';

export interface TaxInput {
  capitalGain: number;
  totalIncome: number; // Total annual income (including wages)
  holdingPeriod: HoldingPeriod;
  filingStatus: FilingStatus;
}

export interface TaxResult {
  federalTax: number;
  federalRate: number;
  stateTax: number;
  stateRate: number;
  totalTax: number;
  effectiveRate: number;
  netProfit: number;
}

// 2024 Federal Long-Term Capital Gains Brackets
const FEDERAL_LTCG_BRACKETS = {
  single: [
    { threshold: 44625, rate: 0 },
    { threshold: 492300, rate: 0.15 },
    { threshold: Infinity, rate: 0.2 },
  ],
  married: [
    { threshold: 89250, rate: 0 },
    { threshold: 553850, rate: 0.15 },
    { threshold: Infinity, rate: 0.2 },
  ],
};

// 2024 Federal Ordinary Income Brackets (for short-term gains)
const FEDERAL_ORDINARY_BRACKETS = {
  single: [
    { threshold: 11600, rate: 0.1 },
    { threshold: 47150, rate: 0.12 },
    { threshold: 100525, rate: 0.22 },
    { threshold: 191950, rate: 0.24 },
    { threshold: 243725, rate: 0.32 },
    { threshold: 609350, rate: 0.35 },
    { threshold: Infinity, rate: 0.37 },
  ],
  married: [
    { threshold: 23200, rate: 0.1 },
    { threshold: 94300, rate: 0.12 },
    { threshold: 201050, rate: 0.22 },
    { threshold: 383900, rate: 0.24 },
    { threshold: 487450, rate: 0.32 },
    { threshold: 731200, rate: 0.35 },
    { threshold: Infinity, rate: 0.37 },
  ],
};

// 2024 New Jersey Tax Brackets (same for all filers)
const NJ_TAX_BRACKETS = [
  { threshold: 20000, rate: 0.014 },
  { threshold: 35000, rate: 0.0175 },
  { threshold: 40000, rate: 0.035 },
  { threshold: 75000, rate: 0.05525 },
  { threshold: 500000, rate: 0.0637 },
  { threshold: 1000000, rate: 0.0897 },
  { threshold: Infinity, rate: 0.1075 },
];

/**
 * Calculate federal tax on long-term capital gains.
 * Uses special preferential rates.
 */
function calculateFederalLTCG(
  gain: number,
  totalIncome: number,
  status: FilingStatus
): { tax: number; rate: number } {
  const brackets = FEDERAL_LTCG_BRACKETS[status];

  // Find the bracket based on total income
  for (const bracket of brackets) {
    if (totalIncome <= bracket.threshold) {
      return {
        tax: gain * bracket.rate,
        rate: bracket.rate,
      };
    }
  }

  // Fallback to highest rate
  return {
    tax: gain * 0.2,
    rate: 0.2,
  };
}

/**
 * Calculate federal tax on short-term gains (ordinary income rates).
 * Uses marginal tax calculation.
 */
function calculateFederalOrdinary(
  gain: number,
  totalIncome: number,
  status: FilingStatus
): { tax: number; rate: number } {
  const brackets = FEDERAL_ORDINARY_BRACKETS[status];
  const incomeBeforeGain = totalIncome - gain;

  let tax = 0;
  let previousThreshold = 0;
  let marginalRate = 0;

  for (const bracket of brackets) {
    // Skip brackets below existing income
    if (incomeBeforeGain >= bracket.threshold) {
      previousThreshold = bracket.threshold;
      continue;
    }

    // Calculate the amount in this bracket
    const incomeInBracket = Math.min(totalIncome, bracket.threshold) - Math.max(incomeBeforeGain, previousThreshold);

    if (incomeInBracket > 0) {
      tax += incomeInBracket * bracket.rate;
      marginalRate = bracket.rate;
    }

    previousThreshold = bracket.threshold;

    if (totalIncome <= bracket.threshold) {
      break;
    }
  }

  return { tax, rate: marginalRate };
}

/**
 * Calculate New Jersey state tax.
 * NJ taxes capital gains as ordinary income.
 */
function calculateNJTax(totalIncome: number): { tax: number; rate: number } {
  let tax = 0;
  let previousThreshold = 0;
  let marginalRate = 0;

  for (const bracket of NJ_TAX_BRACKETS) {
    if (totalIncome <= previousThreshold) break;

    const incomeInBracket =
      Math.min(totalIncome, bracket.threshold) - previousThreshold;

    if (incomeInBracket > 0) {
      tax += incomeInBracket * bracket.rate;
      marginalRate = bracket.rate;
    }

    previousThreshold = bracket.threshold;
  }

  // Calculate effective rate on the capital gain portion only
  // (We're simplifying here - actual calculation would be more complex)
  return { tax, rate: marginalRate };
}

/**
 * Calculate investment taxes for a capital gain in New Jersey.
 *
 * @example
 * // $10,000 long-term gain, $80,000 total income, single filer
 * calculateInvestmentTax({
 *   capitalGain: 10000,
 *   totalIncome: 80000,
 *   holdingPeriod: 'long',
 *   filingStatus: 'single'
 * })
 */
export function calculateInvestmentTax(input: TaxInput): TaxResult {
  const { capitalGain, totalIncome, holdingPeriod, filingStatus } = input;

  // Validate inputs
  if (capitalGain < 0) {
    throw new Error('Capital gain must be non-negative (losses are not calculated here)');
  }
  if (totalIncome < capitalGain) {
    throw new Error('Total income must include the capital gain');
  }

  // Calculate federal tax based on holding period
  let federalResult: { tax: number; rate: number };

  if (holdingPeriod === 'long') {
    federalResult = calculateFederalLTCG(capitalGain, totalIncome, filingStatus);
  } else {
    federalResult = calculateFederalOrdinary(capitalGain, totalIncome, filingStatus);
  }

  // Calculate NJ state tax on the gain portion
  // NJ doesn't differentiate short vs long term - all taxed as ordinary income
  const incomeWithoutGain = totalIncome - capitalGain;
  const njTaxWithGain = calculateNJTax(totalIncome);
  const njTaxWithoutGain = calculateNJTax(incomeWithoutGain);
  const njTaxOnGain = njTaxWithGain.tax - njTaxWithoutGain.tax;

  const totalTax = federalResult.tax + njTaxOnGain;
  const effectiveRate = capitalGain > 0 ? totalTax / capitalGain : 0;
  const netProfit = capitalGain - totalTax;

  return {
    federalTax: Math.round(federalResult.tax * 100) / 100,
    federalRate: federalResult.rate,
    stateTax: Math.round(njTaxOnGain * 100) / 100,
    stateRate: njTaxWithGain.rate,
    totalTax: Math.round(totalTax * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10000) / 10000,
    netProfit: Math.round(netProfit * 100) / 100,
  };
}
