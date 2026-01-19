/**
 * Future Value Calculator
 *
 * Projects how much an investment will be worth in the future.
 * Can include both an initial lump sum and regular contributions.
 *
 * Two main formulas:
 * 1. Future Value of Lump Sum: FV = PV × (1 + r)^n
 * 2. Future Value of Annuity: FV = PMT × [((1 + r)^n - 1) / r]
 *
 * Total FV = Lump Sum FV + Annuity FV
 */

export interface FutureValueInput {
  currentInvestment: number; // Initial lump sum
  monthlyContribution?: number; // Optional regular monthly additions
  annualReturn: number; // Expected annual return (as percentage, e.g., 8 for 8%)
  years: number; // Investment time horizon
}

export interface YearlyProjection {
  year: number;
  startBalance: number;
  contributions: number;
  interestEarned: number;
  endBalance: number;
}

export interface FutureValueResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  effectiveReturn: number; // Total return as percentage
  yearlyProjections: YearlyProjection[];
}

/**
 * Calculate the future value of an investment.
 *
 * @example
 * // $10,000 initial, $500/month, 8% return, 20 years
 * calculateFutureValue({
 *   currentInvestment: 10000,
 *   monthlyContribution: 500,
 *   annualReturn: 8,
 *   years: 20
 * })
 * // Returns: { futureValue: ~344,000, ... }
 */
export function calculateFutureValue(input: FutureValueInput): FutureValueResult {
  const {
    currentInvestment,
    monthlyContribution = 0,
    annualReturn,
    years,
  } = input;

  // Validate inputs
  if (currentInvestment < 0) {
    throw new Error('Current investment must be non-negative');
  }
  if (monthlyContribution < 0) {
    throw new Error('Monthly contribution must be non-negative');
  }
  if (annualReturn < 0) {
    throw new Error('Annual return must be non-negative');
  }
  if (years <= 0) {
    throw new Error('Years must be positive');
  }

  const monthlyRate = annualReturn / 100 / 12;
  const annualContribution = monthlyContribution * 12;

  // Build year-by-year projection
  const yearlyProjections: YearlyProjection[] = [];
  let currentBalance = currentInvestment;
  let totalContributions = currentInvestment;

  for (let year = 1; year <= years; year++) {
    const startBalance = currentBalance;
    const yearContributions = annualContribution;

    // Calculate month by month for accuracy
    for (let month = 0; month < 12; month++) {
      currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
    }

    const interestEarned = currentBalance - startBalance - yearContributions;
    totalContributions += yearContributions;

    yearlyProjections.push({
      year,
      startBalance: Math.round(startBalance * 100) / 100,
      contributions: yearContributions,
      interestEarned: Math.round(interestEarned * 100) / 100,
      endBalance: Math.round(currentBalance * 100) / 100,
    });
  }

  const futureValue = currentBalance;
  const totalInterest = futureValue - totalContributions;
  const effectiveReturn = ((futureValue - totalContributions) / totalContributions) * 100;

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveReturn: Math.round(effectiveReturn * 100) / 100,
    yearlyProjections,
  };
}

/**
 * Calculate how much you need to invest monthly to reach a goal.
 *
 * @example
 * // Want $1,000,000 in 30 years at 8% return, starting with $10,000
 * calculateRequiredContribution({
 *   targetAmount: 1000000,
 *   currentInvestment: 10000,
 *   annualReturn: 8,
 *   years: 30
 * })
 */
export function calculateRequiredContribution(
  targetAmount: number,
  currentInvestment: number,
  annualReturn: number,
  years: number
): number {
  if (targetAmount <= 0 || years <= 0 || annualReturn < 0) {
    throw new Error('Invalid input values');
  }

  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  // Future value of current investment
  const fvLumpSum = currentInvestment * Math.pow(1 + monthlyRate, totalMonths);

  // Amount needed from contributions
  const amountFromContributions = targetAmount - fvLumpSum;

  if (amountFromContributions <= 0) {
    return 0; // Current investment alone will exceed target
  }

  // Solve for monthly payment using annuity formula
  // FV = PMT × [((1 + r)^n - 1) / r]
  // PMT = FV × r / ((1 + r)^n - 1)
  const monthlyContribution =
    (amountFromContributions * monthlyRate) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return Math.round(monthlyContribution * 100) / 100;
}

/**
 * Compare different investment scenarios side by side.
 */
export function compareScenarios(
  scenarios: Array<{
    name: string;
    currentInvestment: number;
    monthlyContribution: number;
    annualReturn: number;
    years: number;
  }>
): Array<{
  name: string;
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
}> {
  return scenarios.map((scenario) => {
    const result = calculateFutureValue({
      currentInvestment: scenario.currentInvestment,
      monthlyContribution: scenario.monthlyContribution,
      annualReturn: scenario.annualReturn,
      years: scenario.years,
    });

    return {
      name: scenario.name,
      futureValue: result.futureValue,
      totalContributions: result.totalContributions,
      totalInterest: result.totalInterest,
    };
  });
}
