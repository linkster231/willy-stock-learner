/**
 * Stock Profit/Loss Calculator
 *
 * Calculates gains, losses, and break-even prices for stock trades.
 * Accounts for buy and sell commissions.
 */

export interface ProfitLossInput {
  buyPrice: number; // Price per share when bought
  sellPrice: number; // Price per share when sold (or current price)
  shares: number; // Number of shares
  buyCommission?: number; // Commission paid when buying (default: 0)
  sellCommission?: number; // Commission paid when selling (default: 0)
}

export interface ProfitLossResult {
  totalCost: number; // Total cost including commission
  totalProceeds: number; // Total proceeds after commission
  grossProfit: number; // Profit before commissions
  netProfit: number; // Profit after commissions
  percentGain: number; // Percentage gain/loss
  breakEvenPrice: number; // Price needed to break even
  profitPerShare: number; // Net profit per share
}

/**
 * Calculate profit or loss from a stock trade.
 *
 * @example
 * // Bought 100 shares at $50, sold at $60, $10 commission each way
 * calculateProfitLoss({
 *   buyPrice: 50,
 *   sellPrice: 60,
 *   shares: 100,
 *   buyCommission: 10,
 *   sellCommission: 10
 * })
 * // Returns: { netProfit: 980, percentGain: 19.6, ... }
 */
export function calculateProfitLoss(input: ProfitLossInput): ProfitLossResult {
  const {
    buyPrice,
    sellPrice,
    shares,
    buyCommission = 0,
    sellCommission = 0,
  } = input;

  // Validate inputs
  if (buyPrice <= 0) {
    throw new Error('Buy price must be positive');
  }
  if (sellPrice < 0) {
    throw new Error('Sell price must be non-negative');
  }
  if (shares <= 0) {
    throw new Error('Number of shares must be positive');
  }
  if (buyCommission < 0 || sellCommission < 0) {
    throw new Error('Commissions must be non-negative');
  }

  // Calculate costs and proceeds
  const purchaseCost = buyPrice * shares;
  const totalCost = purchaseCost + buyCommission;
  const saleProceeds = sellPrice * shares;
  const totalProceeds = saleProceeds - sellCommission;

  // Calculate profit
  const grossProfit = saleProceeds - purchaseCost;
  const netProfit = totalProceeds - totalCost;

  // Calculate percentage gain based on total cost
  const percentGain = (netProfit / totalCost) * 100;

  // Calculate break-even price
  // Break even when: (breakEvenPrice * shares) - sellCommission = totalCost
  // breakEvenPrice = (totalCost + sellCommission) / shares
  const breakEvenPrice = (totalCost + sellCommission) / shares;

  // Profit per share
  const profitPerShare = netProfit / shares;

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    totalProceeds: Math.round(totalProceeds * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    percentGain: Math.round(percentGain * 100) / 100,
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
    profitPerShare: Math.round(profitPerShare * 100) / 100,
  };
}
