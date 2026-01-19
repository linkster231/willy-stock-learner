/**
 * Position Size Calculator
 *
 * Helps determine how much to invest in a single trade based on
 * risk management principles.
 *
 * Key concepts:
 * - Risk only a small percentage of your account per trade (1-2%)
 * - Set a stop loss to limit maximum loss
 * - Position size = (Account × Risk%) / (Entry - Stop Loss)
 *
 * This is one of the most important tools for protecting your capital.
 */

export interface PositionSizeInput {
  accountBalance: number; // Total account value
  riskPercent: number; // Percentage willing to risk (e.g., 2 for 2%)
  entryPrice: number; // Price you plan to buy at
  stopLossPrice: number; // Price where you'll sell to limit losses
}

export interface PositionSizeResult {
  maxRiskAmount: number; // Maximum dollars to risk
  riskPerShare: number; // Dollar difference between entry and stop
  sharesCount: number; // Number of shares to buy
  totalInvestment: number; // Total dollar amount to invest
  percentOfAccount: number; // What % of account this represents
  potentialLoss: number; // Maximum loss if stop is hit
}

/**
 * Calculate the appropriate position size for a trade.
 *
 * @example
 * // $50,000 account, risk 2%, buy at $100, stop loss at $95
 * calculatePositionSize({
 *   accountBalance: 50000,
 *   riskPercent: 2,
 *   entryPrice: 100,
 *   stopLossPrice: 95
 * })
 * // Returns: { sharesCount: 200, totalInvestment: 20000, potentialLoss: 1000 }
 */
export function calculatePositionSize(
  input: PositionSizeInput
): PositionSizeResult {
  const { accountBalance, riskPercent, entryPrice, stopLossPrice } = input;

  // Validate inputs
  if (accountBalance <= 0) {
    throw new Error('Account balance must be positive');
  }
  if (riskPercent <= 0 || riskPercent > 100) {
    throw new Error('Risk percent must be between 0 and 100');
  }
  if (entryPrice <= 0) {
    throw new Error('Entry price must be positive');
  }
  if (stopLossPrice <= 0) {
    throw new Error('Stop loss price must be positive');
  }
  if (stopLossPrice >= entryPrice) {
    throw new Error('Stop loss must be below entry price for a long position');
  }

  // Calculate maximum amount willing to risk
  const maxRiskAmount = (accountBalance * riskPercent) / 100;

  // Calculate risk per share (how much you lose per share if stop is hit)
  const riskPerShare = entryPrice - stopLossPrice;

  // Calculate position size: shares = maxRisk / riskPerShare
  const sharesCount = Math.floor(maxRiskAmount / riskPerShare);

  // Calculate total investment needed
  const totalInvestment = sharesCount * entryPrice;

  // Calculate what percentage of account this represents
  const percentOfAccount = (totalInvestment / accountBalance) * 100;

  // Calculate actual potential loss
  const potentialLoss = sharesCount * riskPerShare;

  return {
    maxRiskAmount: Math.round(maxRiskAmount * 100) / 100,
    riskPerShare: Math.round(riskPerShare * 100) / 100,
    sharesCount,
    totalInvestment: Math.round(totalInvestment * 100) / 100,
    percentOfAccount: Math.round(percentOfAccount * 100) / 100,
    potentialLoss: Math.round(potentialLoss * 100) / 100,
  };
}

/**
 * Calculate stop loss price for a given risk tolerance.
 * Use when you know how much you want to invest and risk.
 */
export function calculateStopLoss(
  accountBalance: number,
  riskPercent: number,
  entryPrice: number,
  numberOfShares: number
): number {
  if (numberOfShares <= 0) {
    throw new Error('Number of shares must be positive');
  }

  const maxRiskAmount = (accountBalance * riskPercent) / 100;
  const riskPerShare = maxRiskAmount / numberOfShares;
  const stopLossPrice = entryPrice - riskPerShare;

  return Math.round(stopLossPrice * 100) / 100;
}

/**
 * Calculate the risk-reward ratio for a trade.
 * Compares potential profit to potential loss.
 *
 * A ratio of 2:1 means you stand to gain $2 for every $1 risked.
 * Most successful traders aim for at least 2:1.
 */
export function calculateRiskReward(
  entryPrice: number,
  stopLossPrice: number,
  targetPrice: number
): {
  riskPerShare: number;
  rewardPerShare: number;
  ratio: number;
  isGoodRatio: boolean;
} {
  if (stopLossPrice >= entryPrice) {
    throw new Error('Stop loss must be below entry price');
  }
  if (targetPrice <= entryPrice) {
    throw new Error('Target price must be above entry price');
  }

  const riskPerShare = entryPrice - stopLossPrice;
  const rewardPerShare = targetPrice - entryPrice;
  const ratio = rewardPerShare / riskPerShare;

  return {
    riskPerShare: Math.round(riskPerShare * 100) / 100,
    rewardPerShare: Math.round(rewardPerShare * 100) / 100,
    ratio: Math.round(ratio * 100) / 100,
    isGoodRatio: ratio >= 2, // 2:1 or better is considered good
  };
}
