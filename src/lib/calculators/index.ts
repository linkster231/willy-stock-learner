/**
 * Calculator Functions
 *
 * Pure functions for financial calculations.
 * All functions are well-documented and handle edge cases.
 */

// Compound Interest
export {
  calculateCompoundInterest,
  type CompoundInterestInput,
  type CompoundInterestResult,
  type YearlyBreakdown,
} from './compound-interest';

// Profit/Loss
export {
  calculateProfitLoss,
  type ProfitLossInput,
  type ProfitLossResult,
} from './profit-loss';

// Tax (NJ)
export {
  calculateInvestmentTax,
  type TaxInput,
  type TaxResult,
  type FilingStatus,
  type HoldingPeriod,
} from './tax-nj';

// Dividend
export {
  calculateDividend,
  calculateSharesForIncome,
  type DividendInput,
  type DividendResult,
  type DividendFrequency,
} from './dividend';

// Dollar-Cost Averaging
export {
  calculateDCA,
  compareDCAvsLumpSum,
  type DCAInput,
  type DCAResult,
  type DCAMonthData,
} from './dca';

// Position Size
export {
  calculatePositionSize,
  calculateStopLoss,
  calculateRiskReward,
  type PositionSizeInput,
  type PositionSizeResult,
} from './position-size';

// Rule of 72
export {
  calculateRule72,
  calculateRequiredReturn,
  compareReturns,
  type Rule72Input,
  type Rule72Result,
} from './rule-of-72';

// Future Value
export {
  calculateFutureValue,
  calculateRequiredContribution,
  compareScenarios,
  type FutureValueInput,
  type FutureValueResult,
  type YearlyProjection,
} from './future-value';
