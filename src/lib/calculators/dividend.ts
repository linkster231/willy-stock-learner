/**
 * Dividend Yield Calculator
 *
 * Calculates dividend income from stocks.
 * Useful for income-focused investors.
 *
 * Key concepts:
 * - Dividend Yield = Annual Dividend / Stock Price
 * - Annual Income = Dividend Per Share × Number of Shares × Payments Per Year
 */

export type DividendFrequency = 'monthly' | 'quarterly' | 'semiannually' | 'annually';

export interface DividendInput {
  stockPrice: number; // Current price per share
  dividendPerShare: number; // Dividend amount per payment
  frequency: DividendFrequency; // How often dividends are paid
  numberOfShares: number; // Shares owned
}

export interface DividendResult {
  annualDividendPerShare: number;
  annualYield: number; // As decimal (0.04 for 4%)
  annualIncome: number;
  monthlyIncome: number;
  quarterlyIncome: number;
  paymentsPerYear: number;
}

/**
 * Get the number of dividend payments per year based on frequency.
 */
function getPaymentsPerYear(frequency: DividendFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12;
    case 'quarterly':
      return 4;
    case 'semiannually':
      return 2;
    case 'annually':
      return 1;
    default:
      return 4; // Default to quarterly (most common)
  }
}

/**
 * Calculate dividend income and yield.
 *
 * @example
 * // Stock at $100, pays $0.50 quarterly, own 100 shares
 * calculateDividend({
 *   stockPrice: 100,
 *   dividendPerShare: 0.50,
 *   frequency: 'quarterly',
 *   numberOfShares: 100
 * })
 * // Returns: { annualYield: 0.02, annualIncome: 200, ... }
 */
export function calculateDividend(input: DividendInput): DividendResult {
  const { stockPrice, dividendPerShare, frequency, numberOfShares } = input;

  // Validate inputs
  if (stockPrice <= 0) {
    throw new Error('Stock price must be positive');
  }
  if (dividendPerShare < 0) {
    throw new Error('Dividend per share must be non-negative');
  }
  if (numberOfShares < 0) {
    throw new Error('Number of shares must be non-negative');
  }

  const paymentsPerYear = getPaymentsPerYear(frequency);

  // Calculate annual dividend per share
  const annualDividendPerShare = dividendPerShare * paymentsPerYear;

  // Calculate annual yield
  const annualYield = annualDividendPerShare / stockPrice;

  // Calculate income
  const annualIncome = annualDividendPerShare * numberOfShares;
  const monthlyIncome = annualIncome / 12;
  const quarterlyIncome = annualIncome / 4;

  return {
    annualDividendPerShare: Math.round(annualDividendPerShare * 100) / 100,
    annualYield: Math.round(annualYield * 10000) / 10000,
    annualIncome: Math.round(annualIncome * 100) / 100,
    monthlyIncome: Math.round(monthlyIncome * 100) / 100,
    quarterlyIncome: Math.round(quarterlyIncome * 100) / 100,
    paymentsPerYear,
  };
}

/**
 * Calculate how many shares needed for a target monthly income.
 *
 * @example
 * // Want $500/month from a stock paying $0.50 quarterly at $100/share
 * calculateSharesForIncome({
 *   stockPrice: 100,
 *   dividendPerShare: 0.50,
 *   frequency: 'quarterly',
 *   targetMonthlyIncome: 500
 * })
 * // Returns: 3000 shares ($300,000 investment)
 */
export function calculateSharesForIncome(
  stockPrice: number,
  dividendPerShare: number,
  frequency: DividendFrequency,
  targetMonthlyIncome: number
): { sharesNeeded: number; investmentRequired: number } {
  if (stockPrice <= 0 || dividendPerShare <= 0 || targetMonthlyIncome <= 0) {
    throw new Error('All values must be positive');
  }

  const paymentsPerYear = getPaymentsPerYear(frequency);
  const annualDividendPerShare = dividendPerShare * paymentsPerYear;
  const targetAnnualIncome = targetMonthlyIncome * 12;

  const sharesNeeded = Math.ceil(targetAnnualIncome / annualDividendPerShare);
  const investmentRequired = sharesNeeded * stockPrice;

  return {
    sharesNeeded,
    investmentRequired: Math.round(investmentRequired * 100) / 100,
  };
}
