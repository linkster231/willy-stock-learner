/**
 * Dollar-Cost Averaging (DCA) Calculator
 *
 * Calculates the results of investing a fixed amount at regular intervals.
 * DCA helps reduce the impact of volatility by buying more shares when
 * prices are low and fewer when prices are high.
 *
 * Key benefits:
 * - Removes emotion from investing decisions
 * - Reduces timing risk
 * - Builds investing discipline
 */

export interface DCAInput {
  monthlyInvestment: number; // Fixed amount invested each month
  months: number; // Number of months
  priceHistory?: number[]; // Optional: actual price history for simulation
  averagePrice?: number; // Optional: average expected price if no history
  priceVolatility?: number; // Optional: expected volatility (e.g., 0.1 for 10%)
}

export interface DCAMonthData {
  month: number;
  price: number;
  sharesBought: number;
  totalShares: number;
  totalInvested: number;
  averageCost: number;
  currentValue: number;
}

export interface DCAResult {
  totalInvested: number;
  totalShares: number;
  averageCostPerShare: number;
  currentValue: number;
  totalReturn: number;
  percentReturn: number;
  monthlyBreakdown: DCAMonthData[];
}

/**
 * Generate simulated price history with volatility.
 * Uses a simple random walk model for demonstration.
 */
function generatePriceHistory(
  months: number,
  startPrice: number,
  volatility: number
): number[] {
  const prices: number[] = [startPrice];
  let currentPrice = startPrice;

  for (let i = 1; i < months; i++) {
    // Random walk with drift toward mean
    const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
    currentPrice = Math.max(currentPrice + change, startPrice * 0.5); // Floor at 50% of start
    currentPrice = Math.min(currentPrice, startPrice * 1.5); // Cap at 150% of start
    prices.push(Math.round(currentPrice * 100) / 100);
  }

  return prices;
}

/**
 * Calculate dollar-cost averaging results.
 *
 * @example
 * // Invest $500/month for 12 months at average price of $50
 * calculateDCA({
 *   monthlyInvestment: 500,
 *   months: 12,
 *   averagePrice: 50,
 *   priceVolatility: 0.15
 * })
 */
export function calculateDCA(input: DCAInput): DCAResult {
  const {
    monthlyInvestment,
    months,
    priceHistory,
    averagePrice = 100,
    priceVolatility = 0.1,
  } = input;

  // Validate inputs
  if (monthlyInvestment <= 0) {
    throw new Error('Monthly investment must be positive');
  }
  if (months <= 0) {
    throw new Error('Number of months must be positive');
  }

  // Use provided price history or generate simulated one
  const prices =
    priceHistory && priceHistory.length >= months
      ? priceHistory.slice(0, months)
      : generatePriceHistory(months, averagePrice, priceVolatility);

  // Calculate DCA results month by month
  const monthlyBreakdown: DCAMonthData[] = [];
  let totalShares = 0;
  let totalInvested = 0;

  for (let i = 0; i < months; i++) {
    const price = prices[i];
    const sharesBought = monthlyInvestment / price;

    totalShares += sharesBought;
    totalInvested += monthlyInvestment;

    const averageCost = totalInvested / totalShares;
    const currentValue = totalShares * price;

    monthlyBreakdown.push({
      month: i + 1,
      price: Math.round(price * 100) / 100,
      sharesBought: Math.round(sharesBought * 1000) / 1000,
      totalShares: Math.round(totalShares * 1000) / 1000,
      totalInvested: Math.round(totalInvested * 100) / 100,
      averageCost: Math.round(averageCost * 100) / 100,
      currentValue: Math.round(currentValue * 100) / 100,
    });
  }

  // Final calculations
  const finalPrice = prices[prices.length - 1];
  const currentValue = totalShares * finalPrice;
  const totalReturn = currentValue - totalInvested;
  const percentReturn = (totalReturn / totalInvested) * 100;

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalShares: Math.round(totalShares * 1000) / 1000,
    averageCostPerShare: Math.round((totalInvested / totalShares) * 100) / 100,
    currentValue: Math.round(currentValue * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    percentReturn: Math.round(percentReturn * 100) / 100,
    monthlyBreakdown,
  };
}

/**
 * Compare DCA vs lump sum investment.
 * Shows the difference between investing all at once vs. spreading it out.
 */
export function compareDCAvsLumpSum(
  totalAmount: number,
  months: number,
  priceHistory: number[]
): {
  dcaResult: DCAResult;
  lumpSumValue: number;
  lumpSumReturn: number;
  lumpSumPercentReturn: number;
  dcaWins: boolean;
} {
  const monthlyInvestment = totalAmount / months;
  const dcaResult = calculateDCA({
    monthlyInvestment,
    months,
    priceHistory,
  });

  // Lump sum: buy all shares at first month's price
  const firstPrice = priceHistory[0];
  const lastPrice = priceHistory[priceHistory.length - 1];
  const lumpSumShares = totalAmount / firstPrice;
  const lumpSumValue = lumpSumShares * lastPrice;
  const lumpSumReturn = lumpSumValue - totalAmount;
  const lumpSumPercentReturn = (lumpSumReturn / totalAmount) * 100;

  return {
    dcaResult,
    lumpSumValue: Math.round(lumpSumValue * 100) / 100,
    lumpSumReturn: Math.round(lumpSumReturn * 100) / 100,
    lumpSumPercentReturn: Math.round(lumpSumPercentReturn * 100) / 100,
    dcaWins: dcaResult.currentValue > lumpSumValue,
  };
}
