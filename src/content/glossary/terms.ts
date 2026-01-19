/**
 * Glossary Terms
 *
 * Comprehensive financial glossary with 50+ terms organized by category.
 * All text uses translation keys for i18n support.
 */

import { GlossaryTerm } from '@/types/content';

export const glossaryTerms: GlossaryTerm[] = [
  // ============================================
  // BASICS CATEGORY
  // ============================================
  {
    id: 'stock',
    termKey: 'glossary.terms.stock.term',
    definitionKey: 'glossary.terms.stock.definition',
    category: 'basics',
    relatedTerms: ['share', 'equity', 'ownership'],
    example: 'glossary.terms.stock.example',
  },
  {
    id: 'share',
    termKey: 'glossary.terms.share.term',
    definitionKey: 'glossary.terms.share.definition',
    category: 'basics',
    relatedTerms: ['stock', 'equity', 'ownership'],
    example: 'glossary.terms.share.example',
  },
  {
    id: 'equity',
    termKey: 'glossary.terms.equity.term',
    definitionKey: 'glossary.terms.equity.definition',
    category: 'basics',
    relatedTerms: ['stock', 'share', 'ownership'],
    example: 'glossary.terms.equity.example',
  },
  {
    id: 'dividend',
    termKey: 'glossary.terms.dividend.term',
    definitionKey: 'glossary.terms.dividend.definition',
    category: 'basics',
    relatedTerms: ['dividend-yield', 'payout-ratio', 'stock'],
    example: 'glossary.terms.dividend.example',
  },
  {
    id: 'broker',
    termKey: 'glossary.terms.broker.term',
    definitionKey: 'glossary.terms.broker.definition',
    category: 'basics',
    relatedTerms: ['brokerage', 'commission'],
    example: 'glossary.terms.broker.example',
  },
  {
    id: 'brokerage',
    termKey: 'glossary.terms.brokerage.term',
    definitionKey: 'glossary.terms.brokerage.definition',
    category: 'basics',
    relatedTerms: ['broker', 'commission'],
    example: 'glossary.terms.brokerage.example',
  },
  {
    id: 'portfolio',
    termKey: 'glossary.terms.portfolio.term',
    definitionKey: 'glossary.terms.portfolio.definition',
    category: 'basics',
    relatedTerms: ['diversification', 'asset-allocation'],
    example: 'glossary.terms.portfolio.example',
  },
  {
    id: 'index',
    termKey: 'glossary.terms.index.term',
    definitionKey: 'glossary.terms.index.definition',
    category: 'basics',
    relatedTerms: ['etf', 'index-fund', 'benchmark'],
    example: 'glossary.terms.index.example',
  },
  {
    id: 'etf',
    termKey: 'glossary.terms.etf.term',
    definitionKey: 'glossary.terms.etf.definition',
    category: 'basics',
    relatedTerms: ['index', 'mutual-fund', 'diversification'],
    example: 'glossary.terms.etf.example',
  },
  {
    id: 'mutual-fund',
    termKey: 'glossary.terms.mutual-fund.term',
    definitionKey: 'glossary.terms.mutual-fund.definition',
    category: 'basics',
    relatedTerms: ['etf', 'diversification', 'expense-ratio'],
    example: 'glossary.terms.mutual-fund.example',
  },
  {
    id: 'bond',
    termKey: 'glossary.terms.bond.term',
    definitionKey: 'glossary.terms.bond.definition',
    category: 'basics',
    relatedTerms: ['yield', 'maturity', 'coupon'],
    example: 'glossary.terms.bond.example',
  },
  {
    id: 'diversification',
    termKey: 'glossary.terms.diversification.term',
    definitionKey: 'glossary.terms.diversification.definition',
    category: 'basics',
    relatedTerms: ['portfolio', 'asset-allocation', 'risk'],
    example: 'glossary.terms.diversification.example',
  },
  {
    id: 'asset-allocation',
    termKey: 'glossary.terms.asset-allocation.term',
    definitionKey: 'glossary.terms.asset-allocation.definition',
    category: 'basics',
    relatedTerms: ['portfolio', 'diversification', 'rebalancing'],
    example: 'glossary.terms.asset-allocation.example',
  },
  {
    id: 'ownership',
    termKey: 'glossary.terms.ownership.term',
    definitionKey: 'glossary.terms.ownership.definition',
    category: 'basics',
    relatedTerms: ['stock', 'share', 'equity'],
    example: 'glossary.terms.ownership.example',
  },

  // ============================================
  // TRADING CATEGORY
  // ============================================
  {
    id: 'buy',
    termKey: 'glossary.terms.buy.term',
    definitionKey: 'glossary.terms.buy.definition',
    category: 'trading',
    relatedTerms: ['sell', 'market-order', 'limit-order'],
    example: 'glossary.terms.buy.example',
  },
  {
    id: 'sell',
    termKey: 'glossary.terms.sell.term',
    definitionKey: 'glossary.terms.sell.definition',
    category: 'trading',
    relatedTerms: ['buy', 'market-order', 'limit-order'],
    example: 'glossary.terms.sell.example',
  },
  {
    id: 'limit-order',
    termKey: 'glossary.terms.limit-order.term',
    definitionKey: 'glossary.terms.limit-order.definition',
    category: 'trading',
    relatedTerms: ['market-order', 'stop-loss', 'bid', 'ask'],
    example: 'glossary.terms.limit-order.example',
  },
  {
    id: 'market-order',
    termKey: 'glossary.terms.market-order.term',
    definitionKey: 'glossary.terms.market-order.definition',
    category: 'trading',
    relatedTerms: ['limit-order', 'bid', 'ask', 'spread'],
    example: 'glossary.terms.market-order.example',
  },
  {
    id: 'stop-loss',
    termKey: 'glossary.terms.stop-loss.term',
    definitionKey: 'glossary.terms.stop-loss.definition',
    category: 'trading',
    relatedTerms: ['limit-order', 'trailing-stop', 'risk-management'],
    example: 'glossary.terms.stop-loss.example',
  },
  {
    id: 'trailing-stop',
    termKey: 'glossary.terms.trailing-stop.term',
    definitionKey: 'glossary.terms.trailing-stop.definition',
    category: 'trading',
    relatedTerms: ['stop-loss', 'limit-order'],
    example: 'glossary.terms.trailing-stop.example',
  },
  {
    id: 'bid',
    termKey: 'glossary.terms.bid.term',
    definitionKey: 'glossary.terms.bid.definition',
    category: 'trading',
    relatedTerms: ['ask', 'spread', 'market-order'],
    example: 'glossary.terms.bid.example',
  },
  {
    id: 'ask',
    termKey: 'glossary.terms.ask.term',
    definitionKey: 'glossary.terms.ask.definition',
    category: 'trading',
    relatedTerms: ['bid', 'spread', 'market-order'],
    example: 'glossary.terms.ask.example',
  },
  {
    id: 'spread',
    termKey: 'glossary.terms.spread.term',
    definitionKey: 'glossary.terms.spread.definition',
    category: 'trading',
    relatedTerms: ['bid', 'ask', 'liquidity'],
    example: 'glossary.terms.spread.example',
  },
  {
    id: 'volume',
    termKey: 'glossary.terms.volume.term',
    definitionKey: 'glossary.terms.volume.definition',
    category: 'trading',
    relatedTerms: ['liquidity', 'average-volume'],
    example: 'glossary.terms.volume.example',
  },
  {
    id: 'liquidity',
    termKey: 'glossary.terms.liquidity.term',
    definitionKey: 'glossary.terms.liquidity.definition',
    category: 'trading',
    relatedTerms: ['volume', 'spread', 'market-depth'],
    example: 'glossary.terms.liquidity.example',
  },
  {
    id: 'short-selling',
    termKey: 'glossary.terms.short-selling.term',
    definitionKey: 'glossary.terms.short-selling.definition',
    category: 'trading',
    relatedTerms: ['margin', 'short-squeeze'],
    example: 'glossary.terms.short-selling.example',
  },
  {
    id: 'margin',
    termKey: 'glossary.terms.margin.term',
    definitionKey: 'glossary.terms.margin.definition',
    category: 'trading',
    relatedTerms: ['margin-call', 'leverage', 'short-selling'],
    example: 'glossary.terms.margin.example',
  },
  {
    id: 'day-trading',
    termKey: 'glossary.terms.day-trading.term',
    definitionKey: 'glossary.terms.day-trading.definition',
    category: 'trading',
    relatedTerms: ['swing-trading', 'scalping'],
    example: 'glossary.terms.day-trading.example',
  },

  // ============================================
  // ANALYSIS CATEGORY
  // ============================================
  {
    id: 'pe-ratio',
    termKey: 'glossary.terms.pe-ratio.term',
    definitionKey: 'glossary.terms.pe-ratio.definition',
    category: 'analysis',
    relatedTerms: ['eps', 'valuation', 'forward-pe'],
    example: 'glossary.terms.pe-ratio.example',
  },
  {
    id: 'market-cap',
    termKey: 'glossary.terms.market-cap.term',
    definitionKey: 'glossary.terms.market-cap.definition',
    category: 'analysis',
    relatedTerms: ['small-cap', 'mid-cap', 'large-cap'],
    example: 'glossary.terms.market-cap.example',
  },
  {
    id: 'eps',
    termKey: 'glossary.terms.eps.term',
    definitionKey: 'glossary.terms.eps.definition',
    category: 'analysis',
    relatedTerms: ['pe-ratio', 'net-income', 'diluted-eps'],
    example: 'glossary.terms.eps.example',
  },
  {
    id: 'revenue',
    termKey: 'glossary.terms.revenue.term',
    definitionKey: 'glossary.terms.revenue.definition',
    category: 'analysis',
    relatedTerms: ['net-income', 'profit-margin', 'gross-revenue'],
    example: 'glossary.terms.revenue.example',
  },
  {
    id: 'net-income',
    termKey: 'glossary.terms.net-income.term',
    definitionKey: 'glossary.terms.net-income.definition',
    category: 'analysis',
    relatedTerms: ['revenue', 'profit-margin', 'eps'],
    example: 'glossary.terms.net-income.example',
  },
  {
    id: 'profit-margin',
    termKey: 'glossary.terms.profit-margin.term',
    definitionKey: 'glossary.terms.profit-margin.definition',
    category: 'analysis',
    relatedTerms: ['revenue', 'net-income', 'gross-margin'],
    example: 'glossary.terms.profit-margin.example',
  },
  {
    id: 'book-value',
    termKey: 'glossary.terms.book-value.term',
    definitionKey: 'glossary.terms.book-value.definition',
    category: 'analysis',
    relatedTerms: ['pb-ratio', 'assets', 'liabilities'],
    example: 'glossary.terms.book-value.example',
  },
  {
    id: 'pb-ratio',
    termKey: 'glossary.terms.pb-ratio.term',
    definitionKey: 'glossary.terms.pb-ratio.definition',
    category: 'analysis',
    relatedTerms: ['book-value', 'pe-ratio', 'valuation'],
    example: 'glossary.terms.pb-ratio.example',
  },
  {
    id: 'dividend-yield',
    termKey: 'glossary.terms.dividend-yield.term',
    definitionKey: 'glossary.terms.dividend-yield.definition',
    category: 'analysis',
    relatedTerms: ['dividend', 'payout-ratio', 'yield'],
    example: 'glossary.terms.dividend-yield.example',
  },
  {
    id: 'roe',
    termKey: 'glossary.terms.roe.term',
    definitionKey: 'glossary.terms.roe.definition',
    category: 'analysis',
    relatedTerms: ['roa', 'net-income', 'equity'],
    example: 'glossary.terms.roe.example',
  },
  {
    id: 'roa',
    termKey: 'glossary.terms.roa.term',
    definitionKey: 'glossary.terms.roa.definition',
    category: 'analysis',
    relatedTerms: ['roe', 'net-income', 'assets'],
    example: 'glossary.terms.roa.example',
  },
  {
    id: 'beta',
    termKey: 'glossary.terms.beta.term',
    definitionKey: 'glossary.terms.beta.definition',
    category: 'analysis',
    relatedTerms: ['volatility', 'risk', 'market'],
    example: 'glossary.terms.beta.example',
  },
  {
    id: 'volatility',
    termKey: 'glossary.terms.volatility.term',
    definitionKey: 'glossary.terms.volatility.definition',
    category: 'analysis',
    relatedTerms: ['beta', 'risk', 'standard-deviation'],
    example: 'glossary.terms.volatility.example',
  },
  {
    id: 'bull-market',
    termKey: 'glossary.terms.bull-market.term',
    definitionKey: 'glossary.terms.bull-market.definition',
    category: 'analysis',
    relatedTerms: ['bear-market', 'market-cycle'],
    example: 'glossary.terms.bull-market.example',
  },
  {
    id: 'bear-market',
    termKey: 'glossary.terms.bear-market.term',
    definitionKey: 'glossary.terms.bear-market.definition',
    category: 'analysis',
    relatedTerms: ['bull-market', 'market-cycle', 'correction'],
    example: 'glossary.terms.bear-market.example',
  },

  // ============================================
  // PSYCHOLOGY CATEGORY
  // ============================================
  {
    id: 'fomo',
    termKey: 'glossary.terms.fomo.term',
    definitionKey: 'glossary.terms.fomo.definition',
    category: 'psychology',
    relatedTerms: ['greed', 'emotional-investing', 'hype'],
    example: 'glossary.terms.fomo.example',
  },
  {
    id: 'fear',
    termKey: 'glossary.terms.fear.term',
    definitionKey: 'glossary.terms.fear.definition',
    category: 'psychology',
    relatedTerms: ['panic-selling', 'greed', 'emotional-investing'],
    example: 'glossary.terms.fear.example',
  },
  {
    id: 'greed',
    termKey: 'glossary.terms.greed.term',
    definitionKey: 'glossary.terms.greed.definition',
    category: 'psychology',
    relatedTerms: ['fear', 'fomo', 'overtrading'],
    example: 'glossary.terms.greed.example',
  },
  {
    id: 'panic-selling',
    termKey: 'glossary.terms.panic-selling.term',
    definitionKey: 'glossary.terms.panic-selling.definition',
    category: 'psychology',
    relatedTerms: ['fear', 'paper-hands', 'emotional-investing'],
    example: 'glossary.terms.panic-selling.example',
  },
  {
    id: 'revenge-trading',
    termKey: 'glossary.terms.revenge-trading.term',
    definitionKey: 'glossary.terms.revenge-trading.definition',
    category: 'psychology',
    relatedTerms: ['emotional-investing', 'overtrading', 'discipline'],
    example: 'glossary.terms.revenge-trading.example',
  },
  {
    id: 'paper-hands',
    termKey: 'glossary.terms.paper-hands.term',
    definitionKey: 'glossary.terms.paper-hands.definition',
    category: 'psychology',
    relatedTerms: ['diamond-hands', 'panic-selling', 'fear'],
    example: 'glossary.terms.paper-hands.example',
  },
  {
    id: 'diamond-hands',
    termKey: 'glossary.terms.diamond-hands.term',
    definitionKey: 'glossary.terms.diamond-hands.definition',
    category: 'psychology',
    relatedTerms: ['paper-hands', 'conviction', 'long-term-investing'],
    example: 'glossary.terms.diamond-hands.example',
  },
  {
    id: 'risk-tolerance',
    termKey: 'glossary.terms.risk-tolerance.term',
    definitionKey: 'glossary.terms.risk-tolerance.definition',
    category: 'psychology',
    relatedTerms: ['risk-management', 'asset-allocation', 'volatility'],
    example: 'glossary.terms.risk-tolerance.example',
  },
  {
    id: 'confirmation-bias',
    termKey: 'glossary.terms.confirmation-bias.term',
    definitionKey: 'glossary.terms.confirmation-bias.definition',
    category: 'psychology',
    relatedTerms: ['emotional-investing', 'due-diligence'],
    example: 'glossary.terms.confirmation-bias.example',
  },
  {
    id: 'herd-mentality',
    termKey: 'glossary.terms.herd-mentality.term',
    definitionKey: 'glossary.terms.herd-mentality.definition',
    category: 'psychology',
    relatedTerms: ['fomo', 'bubble', 'contrarian'],
    example: 'glossary.terms.herd-mentality.example',
  },
  {
    id: 'loss-aversion',
    termKey: 'glossary.terms.loss-aversion.term',
    definitionKey: 'glossary.terms.loss-aversion.definition',
    category: 'psychology',
    relatedTerms: ['fear', 'risk-tolerance', 'sunk-cost'],
    example: 'glossary.terms.loss-aversion.example',
  },
  {
    id: 'overconfidence',
    termKey: 'glossary.terms.overconfidence.term',
    definitionKey: 'glossary.terms.overconfidence.definition',
    category: 'psychology',
    relatedTerms: ['greed', 'overtrading', 'risk-management'],
    example: 'glossary.terms.overconfidence.example',
  },
  {
    id: 'patience',
    termKey: 'glossary.terms.patience.term',
    definitionKey: 'glossary.terms.patience.definition',
    category: 'psychology',
    relatedTerms: ['long-term-investing', 'discipline', 'diamond-hands'],
    example: 'glossary.terms.patience.example',
  },

  // ============================================
  // TAX CATEGORY
  // ============================================
  {
    id: 'capital-gains',
    termKey: 'glossary.terms.capital-gains.term',
    definitionKey: 'glossary.terms.capital-gains.definition',
    category: 'tax',
    relatedTerms: ['short-term-gain', 'long-term-gain', 'capital-loss'],
    example: 'glossary.terms.capital-gains.example',
  },
  {
    id: 'capital-loss',
    termKey: 'glossary.terms.capital-loss.term',
    definitionKey: 'glossary.terms.capital-loss.definition',
    category: 'tax',
    relatedTerms: ['capital-gains', 'tax-loss-harvesting'],
    example: 'glossary.terms.capital-loss.example',
  },
  {
    id: 'short-term-gain',
    termKey: 'glossary.terms.short-term-gain.term',
    definitionKey: 'glossary.terms.short-term-gain.definition',
    category: 'tax',
    relatedTerms: ['long-term-gain', 'capital-gains', 'holding-period'],
    example: 'glossary.terms.short-term-gain.example',
  },
  {
    id: 'long-term-gain',
    termKey: 'glossary.terms.long-term-gain.term',
    definitionKey: 'glossary.terms.long-term-gain.definition',
    category: 'tax',
    relatedTerms: ['short-term-gain', 'capital-gains', 'holding-period'],
    example: 'glossary.terms.long-term-gain.example',
  },
  {
    id: 'tax-loss-harvesting',
    termKey: 'glossary.terms.tax-loss-harvesting.term',
    definitionKey: 'glossary.terms.tax-loss-harvesting.definition',
    category: 'tax',
    relatedTerms: ['capital-loss', 'wash-sale', 'tax-efficiency'],
    example: 'glossary.terms.tax-loss-harvesting.example',
  },
  {
    id: 'wash-sale',
    termKey: 'glossary.terms.wash-sale.term',
    definitionKey: 'glossary.terms.wash-sale.definition',
    category: 'tax',
    relatedTerms: ['tax-loss-harvesting', 'capital-loss'],
    example: 'glossary.terms.wash-sale.example',
  },
  {
    id: '401k',
    termKey: 'glossary.terms.401k.term',
    definitionKey: 'glossary.terms.401k.definition',
    category: 'tax',
    relatedTerms: ['ira', 'roth-401k', 'employer-match'],
    example: 'glossary.terms.401k.example',
  },
  {
    id: 'ira',
    termKey: 'glossary.terms.ira.term',
    definitionKey: 'glossary.terms.ira.definition',
    category: 'tax',
    relatedTerms: ['roth-ira', '401k', 'traditional-ira'],
    example: 'glossary.terms.ira.example',
  },
  {
    id: 'roth-ira',
    termKey: 'glossary.terms.roth-ira.term',
    definitionKey: 'glossary.terms.roth-ira.definition',
    category: 'tax',
    relatedTerms: ['ira', 'traditional-ira', 'tax-free-growth'],
    example: 'glossary.terms.roth-ira.example',
  },
  {
    id: 'traditional-ira',
    termKey: 'glossary.terms.traditional-ira.term',
    definitionKey: 'glossary.terms.traditional-ira.definition',
    category: 'tax',
    relatedTerms: ['ira', 'roth-ira', 'tax-deferred'],
    example: 'glossary.terms.traditional-ira.example',
  },
  {
    id: 'cost-basis',
    termKey: 'glossary.terms.cost-basis.term',
    definitionKey: 'glossary.terms.cost-basis.definition',
    category: 'tax',
    relatedTerms: ['capital-gains', 'fifo', 'lifo'],
    example: 'glossary.terms.cost-basis.example',
  },
  {
    id: 'tax-deferred',
    termKey: 'glossary.terms.tax-deferred.term',
    definitionKey: 'glossary.terms.tax-deferred.definition',
    category: 'tax',
    relatedTerms: ['401k', 'traditional-ira', 'tax-free-growth'],
    example: 'glossary.terms.tax-deferred.example',
  },
  {
    id: 'dividend-tax',
    termKey: 'glossary.terms.dividend-tax.term',
    definitionKey: 'glossary.terms.dividend-tax.definition',
    category: 'tax',
    relatedTerms: ['qualified-dividend', 'ordinary-dividend', 'dividend'],
    example: 'glossary.terms.dividend-tax.example',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a glossary term by its ID
 * @param id - The unique identifier of the term
 * @returns The glossary term or undefined if not found
 */
export function getTermById(id: string): GlossaryTerm | undefined {
  return glossaryTerms.find((term) => term.id === id);
}

/**
 * Get all glossary terms in a specific category
 * @param category - The category to filter by
 * @returns Array of glossary terms in the specified category
 */
export function getTermsByCategory(
  category: GlossaryTerm['category']
): GlossaryTerm[] {
  return glossaryTerms.filter((term) => term.category === category);
}

/**
 * Search glossary terms by query string
 * Searches through term IDs and related terms
 * @param query - The search query (case-insensitive)
 * @returns Array of matching glossary terms
 */
export function searchTerms(query: string): GlossaryTerm[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  return glossaryTerms.filter((term) => {
    // Check if the term ID contains the query
    if (term.id.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Check if any related terms contain the query
    if (term.relatedTerms) {
      return term.relatedTerms.some((relatedTerm) =>
        relatedTerm.toLowerCase().includes(normalizedQuery)
      );
    }

    return false;
  });
}

/**
 * Get all unique categories from the glossary
 * @returns Array of category names
 */
export function getAllCategories(): GlossaryTerm['category'][] {
  return ['basics', 'trading', 'analysis', 'psychology', 'tax'];
}

/**
 * Get related terms for a given term
 * @param termId - The ID of the term to find relations for
 * @returns Array of related glossary terms
 */
export function getRelatedTerms(termId: string): GlossaryTerm[] {
  const term = getTermById(termId);
  if (!term || !term.relatedTerms) {
    return [];
  }

  return term.relatedTerms
    .map((relatedId) => getTermById(relatedId))
    .filter((t): t is GlossaryTerm => t !== undefined);
}

/**
 * Get the total count of terms per category
 * @returns Object with category names as keys and counts as values
 */
export function getTermCountByCategory(): Record<
  GlossaryTerm['category'],
  number
> {
  return {
    basics: getTermsByCategory('basics').length,
    trading: getTermsByCategory('trading').length,
    analysis: getTermsByCategory('analysis').length,
    psychology: getTermsByCategory('psychology').length,
    tax: getTermsByCategory('tax').length,
  };
}
