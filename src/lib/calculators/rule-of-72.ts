/**
 * Rule of 72 Calculator
 *
 * A simple mental math shortcut to estimate how long it takes
 * for an investment to double.
 *
 * Formula: Years to Double ≈ 72 / Annual Return %
 *
 * Examples:
 * - 8% return → 72 / 8 = 9 years to double
 * - 12% return → 72 / 12 = 6 years to double
 * - 6% return → 72 / 6 = 12 years to double
 *
 * This rule is remarkably accurate for returns between 6-10%.
 * It becomes less accurate for very high or very low rates.
 */

export interface Rule72Input {
  annualReturn: number; // Annual return as percentage (e.g., 8 for 8%)
}

export interface Rule72Result {
  yearsToDouble: number;
  actualYearsToDouble: number; // More precise calculation
  doublingSchedule: Array<{
    years: number;
    multiplier: number;
    value: number; // Based on $1,000 initial
  }>;
}

/**
 * Calculate years to double using the Rule of 72.
 *
 * @example
 * calculateRule72({ annualReturn: 8 })
 * // Returns: { yearsToDouble: 9, actualYearsToDouble: 9.01, ... }
 */
export function calculateRule72(input: Rule72Input): Rule72Result {
  const { annualReturn } = input;

  // Validate input
  if (annualReturn <= 0) {
    throw new Error('Annual return must be positive');
  }
  if (annualReturn > 100) {
    throw new Error('Annual return above 100% is unrealistic');
  }

  // Rule of 72 estimate
  const yearsToDouble = 72 / annualReturn;

  // More precise calculation using natural log
  // Doubling formula: 2 = (1 + r)^t
  // Solving for t: t = ln(2) / ln(1 + r)
  const rateDecimal = annualReturn / 100;
  const actualYearsToDouble = Math.log(2) / Math.log(1 + rateDecimal);

  // Generate a doubling schedule for the next 40 years
  // Shows how $1,000 grows over time
  const doublingSchedule: Array<{
    years: number;
    multiplier: number;
    value: number;
  }> = [];

  const initialValue = 1000;
  const yearsToShow = Math.min(Math.ceil(yearsToDouble * 4), 40); // Show up to 4 doublings

  for (let year = 0; year <= yearsToShow; year += Math.ceil(yearsToDouble / 2)) {
    const multiplier = Math.pow(1 + rateDecimal, year);
    doublingSchedule.push({
      years: year,
      multiplier: Math.round(multiplier * 100) / 100,
      value: Math.round(initialValue * multiplier * 100) / 100,
    });
  }

  return {
    yearsToDouble: Math.round(yearsToDouble * 100) / 100,
    actualYearsToDouble: Math.round(actualYearsToDouble * 100) / 100,
    doublingSchedule,
  };
}

/**
 * Reverse Rule of 72: Find what return you need to double in N years.
 *
 * @example
 * calculateRequiredReturn(10) // 7.2% to double in 10 years
 */
export function calculateRequiredReturn(yearsToDouble: number): number {
  if (yearsToDouble <= 0) {
    throw new Error('Years must be positive');
  }

  // Using Rule of 72: return = 72 / years
  const estimatedReturn = 72 / yearsToDouble;

  return Math.round(estimatedReturn * 100) / 100;
}

/**
 * Compare different return rates to show the power of higher returns.
 *
 * @example
 * compareReturns([6, 8, 10, 12])
 */
export function compareReturns(
  returns: number[],
  initialAmount: number = 10000,
  years: number = 20
): Array<{
  returnRate: number;
  yearsToDouble: number;
  finalValue: number;
  totalGain: number;
}> {
  return returns.map((rate) => {
    const rateDecimal = rate / 100;
    const yearsToDouble = 72 / rate;
    const finalValue = initialAmount * Math.pow(1 + rateDecimal, years);
    const totalGain = finalValue - initialAmount;

    return {
      returnRate: rate,
      yearsToDouble: Math.round(yearsToDouble * 100) / 100,
      finalValue: Math.round(finalValue * 100) / 100,
      totalGain: Math.round(totalGain * 100) / 100,
    };
  });
}
