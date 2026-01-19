/**
 * Compound Interest Calculator
 *
 * Calculates the future value of an investment using compound interest.
 * Formula: A = P(1 + r/n)^(nt)
 *
 * Where:
 * - A = Final amount
 * - P = Principal (initial investment)
 * - r = Annual interest rate (as decimal)
 * - n = Number of times interest compounds per year
 * - t = Number of years
 */

export interface CompoundInterestInput {
  principal: number;
  annualRate: number; // As decimal (0.08 for 8%)
  years: number;
  compoundingFrequency: number; // Times per year (1=annual, 4=quarterly, 12=monthly, 365=daily)
}

export interface YearlyBreakdown {
  year: number;
  balance: number;
  interestEarned: number;
  totalInterest: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInterest: number;
  effectiveAnnualRate: number;
  yearlyBreakdown: YearlyBreakdown[];
}

/**
 * Calculate compound interest with yearly breakdown.
 *
 * @example
 * // $10,000 at 8% for 10 years, compounded monthly
 * calculateCompoundInterest({
 *   principal: 10000,
 *   annualRate: 0.08,
 *   years: 10,
 *   compoundingFrequency: 12
 * })
 * // Returns: { finalAmount: 22196.40, totalInterest: 12196.40, ... }
 */
export function calculateCompoundInterest(
  input: CompoundInterestInput
): CompoundInterestResult {
  const { principal, annualRate, years, compoundingFrequency } = input;

  // Validate inputs
  if (principal < 0) {
    throw new Error('Principal must be non-negative');
  }
  if (annualRate < 0) {
    throw new Error('Annual rate must be non-negative');
  }
  if (years < 0) {
    throw new Error('Years must be non-negative');
  }
  if (compoundingFrequency <= 0) {
    throw new Error('Compounding frequency must be positive');
  }

  // Calculate final amount: A = P(1 + r/n)^(nt)
  const ratePerPeriod = annualRate / compoundingFrequency;
  const totalPeriods = compoundingFrequency * years;
  const finalAmount = principal * Math.pow(1 + ratePerPeriod, totalPeriods);

  // Calculate total interest earned
  const totalInterest = finalAmount - principal;

  // Calculate effective annual rate (APY)
  // EAR = (1 + r/n)^n - 1
  const effectiveAnnualRate =
    Math.pow(1 + annualRate / compoundingFrequency, compoundingFrequency) - 1;

  // Build yearly breakdown for charting
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let previousBalance = principal;

  for (let year = 0; year <= years; year++) {
    const periodsCompleted = compoundingFrequency * year;
    const balance = principal * Math.pow(1 + ratePerPeriod, periodsCompleted);
    const interestThisYear = year === 0 ? 0 : balance - previousBalance;
    const totalInterestToDate = balance - principal;

    yearlyBreakdown.push({
      year,
      balance: Math.round(balance * 100) / 100,
      interestEarned: Math.round(interestThisYear * 100) / 100,
      totalInterest: Math.round(totalInterestToDate * 100) / 100,
    });

    previousBalance = balance;
  }

  return {
    finalAmount: Math.round(finalAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveAnnualRate: Math.round(effectiveAnnualRate * 10000) / 10000,
    yearlyBreakdown,
  };
}
