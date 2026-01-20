/**
 * Local Stock Database
 *
 * A static database of popular stocks for reliable, offline-capable search.
 * This solves the issue of yahoo-finance2 rate limiting and API failures.
 *
 * Benefits:
 * - Instant search results (no API calls needed)
 * - Works offline
 * - No rate limiting
 * - Includes popular stocks, ETFs, and indices that beginners would search for
 */

export interface LocalStock {
  symbol: string;
  name: string;
  type: 'EQUITY' | 'ETF' | 'INDEX' | 'MUTUALFUND';
  sector?: string;
  dividendYield?: number;
  description?: string;
}

/**
 * Database of popular stocks, ETFs, and indices
 * Curated for a stock learning app aimed at beginners
 */
export const STOCK_DATABASE: LocalStock[] = [
  // ===== MEGA CAP TECH =====
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'EQUITY', sector: 'Technology', dividendYield: 0.5, description: 'iPhone, Mac, iPad maker' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'EQUITY', sector: 'Technology', dividendYield: 0.8, description: 'Windows, Office, Azure cloud' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)', type: 'EQUITY', sector: 'Technology', description: 'Google Search, YouTube, Android' },
  { symbol: 'GOOG', name: 'Alphabet Inc. Class C', type: 'EQUITY', sector: 'Technology', description: 'Google Search, YouTube, Android' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'E-commerce, AWS cloud' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'EQUITY', sector: 'Technology', description: 'Facebook, Instagram, WhatsApp' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'EQUITY', sector: 'Technology', dividendYield: 0.03, description: 'Graphics cards, AI chips' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Electric vehicles, energy storage' },

  // ===== OTHER TECH =====
  { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'EQUITY', sector: 'Technology', description: 'Computer processors, graphics cards' },
  { symbol: 'INTC', name: 'Intel Corporation', type: 'EQUITY', sector: 'Technology', dividendYield: 1.5, description: 'Computer processors' },
  { symbol: 'CRM', name: 'Salesforce Inc.', type: 'EQUITY', sector: 'Technology', description: 'Cloud-based CRM software' },
  { symbol: 'ORCL', name: 'Oracle Corporation', type: 'EQUITY', sector: 'Technology', dividendYield: 1.3, description: 'Database software, cloud' },
  { symbol: 'ADBE', name: 'Adobe Inc.', type: 'EQUITY', sector: 'Technology', description: 'Photoshop, Creative Cloud' },
  { symbol: 'NFLX', name: 'Netflix Inc.', type: 'EQUITY', sector: 'Communication Services', description: 'Streaming video service' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', type: 'EQUITY', sector: 'Financial Services', description: 'Online payments' },
  { symbol: 'SQ', name: 'Block Inc. (Square)', type: 'EQUITY', sector: 'Financial Services', description: 'Payment processing, Cash App' },
  { symbol: 'SHOP', name: 'Shopify Inc.', type: 'EQUITY', sector: 'Technology', description: 'E-commerce platform' },
  { symbol: 'UBER', name: 'Uber Technologies', type: 'EQUITY', sector: 'Technology', description: 'Ride-sharing, food delivery' },
  { symbol: 'LYFT', name: 'Lyft Inc.', type: 'EQUITY', sector: 'Technology', description: 'Ride-sharing service' },
  { symbol: 'SNAP', name: 'Snap Inc.', type: 'EQUITY', sector: 'Technology', description: 'Snapchat social media' },
  { symbol: 'PINS', name: 'Pinterest Inc.', type: 'EQUITY', sector: 'Technology', description: 'Visual discovery platform' },
  { symbol: 'TWLO', name: 'Twilio Inc.', type: 'EQUITY', sector: 'Technology', description: 'Cloud communications' },
  { symbol: 'ZM', name: 'Zoom Video Communications', type: 'EQUITY', sector: 'Technology', description: 'Video conferencing' },
  { symbol: 'DOCU', name: 'DocuSign Inc.', type: 'EQUITY', sector: 'Technology', description: 'Electronic signatures' },
  { symbol: 'PLTR', name: 'Palantir Technologies', type: 'EQUITY', sector: 'Technology', description: 'Data analytics software' },
  { symbol: 'RBLX', name: 'Roblox Corporation', type: 'EQUITY', sector: 'Technology', description: 'Gaming platform' },
  { symbol: 'SPOT', name: 'Spotify Technology', type: 'EQUITY', sector: 'Technology', description: 'Music streaming service' },

  // ===== SEMICONDUCTOR =====
  { symbol: 'AVGO', name: 'Broadcom Inc.', type: 'EQUITY', sector: 'Technology', dividendYield: 2.0, description: 'Semiconductor solutions' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', type: 'EQUITY', sector: 'Technology', dividendYield: 2.2, description: 'Mobile chips, 5G' },
  { symbol: 'TXN', name: 'Texas Instruments', type: 'EQUITY', sector: 'Technology', dividendYield: 2.8, description: 'Analog semiconductors' },
  { symbol: 'MU', name: 'Micron Technology', type: 'EQUITY', sector: 'Technology', description: 'Memory chips' },
  { symbol: 'ASML', name: 'ASML Holding', type: 'EQUITY', sector: 'Technology', dividendYield: 0.7, description: 'Chip manufacturing equipment' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', type: 'EQUITY', sector: 'Technology', dividendYield: 1.5, description: 'Chip manufacturing' },

  // ===== CONSUMER FAVORITES =====
  { symbol: 'DIS', name: 'The Walt Disney Company', type: 'EQUITY', sector: 'Communication Services', description: 'Entertainment, theme parks' },
  { symbol: 'NKE', name: 'Nike Inc.', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 1.3, description: 'Athletic apparel, shoes' },
  { symbol: 'SBUX', name: 'Starbucks Corporation', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 2.3, description: 'Coffee shops worldwide' },
  { symbol: 'MCD', name: "McDonald's Corporation", type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 2.2, description: 'Fast food restaurants' },
  { symbol: 'KO', name: 'The Coca-Cola Company', type: 'EQUITY', sector: 'Consumer Defensive', dividendYield: 3.0, description: 'Beverages' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', type: 'EQUITY', sector: 'Consumer Defensive', dividendYield: 2.7, description: 'Beverages and snacks' },
  { symbol: 'WMT', name: 'Walmart Inc.', type: 'EQUITY', sector: 'Consumer Defensive', dividendYield: 1.4, description: 'Retail stores' },
  { symbol: 'TGT', name: 'Target Corporation', type: 'EQUITY', sector: 'Consumer Defensive', dividendYield: 2.8, description: 'Retail stores' },
  { symbol: 'COST', name: 'Costco Wholesale', type: 'EQUITY', sector: 'Consumer Defensive', dividendYield: 0.6, description: 'Warehouse retail' },
  { symbol: 'HD', name: 'The Home Depot', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 2.5, description: 'Home improvement stores' },
  { symbol: 'LOW', name: "Lowe's Companies", type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 1.9, description: 'Home improvement stores' },
  { symbol: 'CMG', name: 'Chipotle Mexican Grill', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Fast-casual restaurants' },
  { symbol: 'YUM', name: 'Yum! Brands', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 1.9, description: 'KFC, Taco Bell, Pizza Hut' },
  { symbol: 'LULU', name: 'Lululemon Athletica', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Athletic apparel' },

  // ===== FINANCIALS =====
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'EQUITY', sector: 'Financial Services', dividendYield: 2.5, description: 'Largest US bank' },
  { symbol: 'BAC', name: 'Bank of America', type: 'EQUITY', sector: 'Financial Services', dividendYield: 2.6, description: 'Major US bank' },
  { symbol: 'WFC', name: 'Wells Fargo & Company', type: 'EQUITY', sector: 'Financial Services', dividendYield: 2.8, description: 'Major US bank' },
  { symbol: 'C', name: 'Citigroup Inc.', type: 'EQUITY', sector: 'Financial Services', dividendYield: 3.5, description: 'Global bank' },
  { symbol: 'GS', name: 'Goldman Sachs', type: 'EQUITY', sector: 'Financial Services', dividendYield: 2.4, description: 'Investment bank' },
  { symbol: 'MS', name: 'Morgan Stanley', type: 'EQUITY', sector: 'Financial Services', dividendYield: 3.2, description: 'Investment bank' },
  { symbol: 'V', name: 'Visa Inc.', type: 'EQUITY', sector: 'Financial Services', dividendYield: 0.8, description: 'Payment network' },
  { symbol: 'MA', name: 'Mastercard Inc.', type: 'EQUITY', sector: 'Financial Services', dividendYield: 0.6, description: 'Payment network' },
  { symbol: 'AXP', name: 'American Express', type: 'EQUITY', sector: 'Financial Services', dividendYield: 1.2, description: 'Credit cards' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', type: 'EQUITY', sector: 'Financial Services', description: "Warren Buffett's company" },
  { symbol: 'BLK', name: 'BlackRock Inc.', type: 'EQUITY', sector: 'Financial Services', dividendYield: 2.5, description: 'Asset management' },
  { symbol: 'SCHW', name: 'Charles Schwab', type: 'EQUITY', sector: 'Financial Services', dividendYield: 1.4, description: 'Brokerage services' },

  // ===== HEALTHCARE =====
  { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'EQUITY', sector: 'Healthcare', dividendYield: 3.0, description: 'Pharmaceuticals, consumer health' },
  { symbol: 'UNH', name: 'UnitedHealth Group', type: 'EQUITY', sector: 'Healthcare', dividendYield: 1.4, description: 'Health insurance' },
  { symbol: 'PFE', name: 'Pfizer Inc.', type: 'EQUITY', sector: 'Healthcare', dividendYield: 5.8, description: 'Pharmaceuticals' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', type: 'EQUITY', sector: 'Healthcare', dividendYield: 3.8, description: 'Pharmaceuticals' },
  { symbol: 'MRK', name: 'Merck & Co.', type: 'EQUITY', sector: 'Healthcare', dividendYield: 2.5, description: 'Pharmaceuticals' },
  { symbol: 'LLY', name: 'Eli Lilly and Company', type: 'EQUITY', sector: 'Healthcare', dividendYield: 0.8, description: 'Pharmaceuticals' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific', type: 'EQUITY', sector: 'Healthcare', dividendYield: 0.3, description: 'Lab equipment' },
  { symbol: 'ABT', name: 'Abbott Laboratories', type: 'EQUITY', sector: 'Healthcare', dividendYield: 1.8, description: 'Medical devices' },
  { symbol: 'MDT', name: 'Medtronic plc', type: 'EQUITY', sector: 'Healthcare', dividendYield: 3.3, description: 'Medical devices' },
  { symbol: 'CVS', name: 'CVS Health Corporation', type: 'EQUITY', sector: 'Healthcare', dividendYield: 3.5, description: 'Pharmacy, health services' },

  // ===== ENERGY =====
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', type: 'EQUITY', sector: 'Energy', dividendYield: 3.4, description: 'Oil and gas' },
  { symbol: 'CVX', name: 'Chevron Corporation', type: 'EQUITY', sector: 'Energy', dividendYield: 4.0, description: 'Oil and gas' },
  { symbol: 'COP', name: 'ConocoPhillips', type: 'EQUITY', sector: 'Energy', dividendYield: 2.0, description: 'Oil and gas exploration' },
  { symbol: 'SLB', name: 'Schlumberger Limited', type: 'EQUITY', sector: 'Energy', dividendYield: 2.3, description: 'Oilfield services' },
  { symbol: 'EOG', name: 'EOG Resources', type: 'EQUITY', sector: 'Energy', dividendYield: 2.8, description: 'Oil and gas exploration' },

  // ===== INDUSTRIALS =====
  { symbol: 'BA', name: 'The Boeing Company', type: 'EQUITY', sector: 'Industrials', description: 'Aircraft manufacturer' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', type: 'EQUITY', sector: 'Industrials', dividendYield: 1.6, description: 'Construction equipment' },
  { symbol: 'GE', name: 'General Electric', type: 'EQUITY', sector: 'Industrials', dividendYield: 0.7, description: 'Diversified industrial' },
  { symbol: 'HON', name: 'Honeywell International', type: 'EQUITY', sector: 'Industrials', dividendYield: 2.1, description: 'Diversified technology' },
  { symbol: 'UPS', name: 'United Parcel Service', type: 'EQUITY', sector: 'Industrials', dividendYield: 4.3, description: 'Package delivery' },
  { symbol: 'FDX', name: 'FedEx Corporation', type: 'EQUITY', sector: 'Industrials', dividendYield: 2.0, description: 'Package delivery' },
  { symbol: 'RTX', name: 'RTX Corporation', type: 'EQUITY', sector: 'Industrials', dividendYield: 2.4, description: 'Aerospace and defense' },
  { symbol: 'LMT', name: 'Lockheed Martin', type: 'EQUITY', sector: 'Industrials', dividendYield: 2.7, description: 'Defense contractor' },
  { symbol: 'DE', name: 'Deere & Company', type: 'EQUITY', sector: 'Industrials', dividendYield: 1.4, description: 'Farm equipment' },

  // ===== COMMUNICATION =====
  { symbol: 'T', name: 'AT&T Inc.', type: 'EQUITY', sector: 'Communication Services', dividendYield: 6.5, description: 'Telecommunications' },
  { symbol: 'VZ', name: 'Verizon Communications', type: 'EQUITY', sector: 'Communication Services', dividendYield: 6.8, description: 'Telecommunications' },
  { symbol: 'TMUS', name: 'T-Mobile US', type: 'EQUITY', sector: 'Communication Services', dividendYield: 1.6, description: 'Wireless carrier' },
  { symbol: 'CMCSA', name: 'Comcast Corporation', type: 'EQUITY', sector: 'Communication Services', dividendYield: 2.8, description: 'Cable and media' },

  // ===== REAL ESTATE (REITs) =====
  { symbol: 'AMT', name: 'American Tower Corp', type: 'EQUITY', sector: 'Real Estate', dividendYield: 3.2, description: 'Cell tower REIT' },
  { symbol: 'PLD', name: 'Prologis Inc.', type: 'EQUITY', sector: 'Real Estate', dividendYield: 2.8, description: 'Logistics REIT' },
  { symbol: 'CCI', name: 'Crown Castle Inc.', type: 'EQUITY', sector: 'Real Estate', dividendYield: 5.8, description: 'Cell tower REIT' },
  { symbol: 'O', name: 'Realty Income Corp', type: 'EQUITY', sector: 'Real Estate', dividendYield: 5.5, description: 'Monthly dividend REIT' },
  { symbol: 'SPG', name: 'Simon Property Group', type: 'EQUITY', sector: 'Real Estate', dividendYield: 5.5, description: 'Mall REIT' },

  // ===== POPULAR ETFs =====
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', dividendYield: 1.4, description: 'Tracks S&P 500 index' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', dividendYield: 1.4, description: 'Low-cost S&P 500 fund' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', dividendYield: 1.4, description: 'Entire US stock market' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', dividendYield: 0.5, description: 'Nasdaq-100 index' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF', dividendYield: 1.3, description: 'Small-cap stocks' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial ETF', type: 'ETF', dividendYield: 1.8, description: 'Dow Jones 30 stocks' },
  { symbol: 'VGT', name: 'Vanguard Information Technology ETF', type: 'ETF', dividendYield: 0.6, description: 'Tech sector' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR', type: 'ETF', dividendYield: 0.7, description: 'Tech sector' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR', type: 'ETF', dividendYield: 1.8, description: 'Financial sector' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR', type: 'ETF', dividendYield: 3.5, description: 'Energy sector' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR', type: 'ETF', dividendYield: 1.5, description: 'Healthcare sector' },
  { symbol: 'XLY', name: 'Consumer Discretionary SPDR', type: 'ETF', dividendYield: 0.8, description: 'Consumer discretionary' },
  { symbol: 'XLP', name: 'Consumer Staples Select SPDR', type: 'ETF', dividendYield: 2.5, description: 'Consumer staples' },
  { symbol: 'XLI', name: 'Industrial Select Sector SPDR', type: 'ETF', dividendYield: 1.5, description: 'Industrial sector' },
  { symbol: 'XLU', name: 'Utilities Select Sector SPDR', type: 'ETF', dividendYield: 3.0, description: 'Utilities sector' },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', type: 'ETF', description: 'Disruptive innovation' },
  { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', type: 'ETF', dividendYield: 4.0, description: 'Real estate sector' },
  { symbol: 'VXUS', name: 'Vanguard Total International Stock ETF', type: 'ETF', dividendYield: 3.0, description: 'International stocks' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', dividendYield: 3.2, description: 'Developed markets' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', type: 'ETF', dividendYield: 3.5, description: 'Emerging markets' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'ETF', dividendYield: 3.5, description: 'US bond market' },
  { symbol: 'AGG', name: 'iShares Core US Aggregate Bond ETF', type: 'ETF', dividendYield: 3.3, description: 'US bond market' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', type: 'ETF', dividendYield: 3.8, description: 'Long-term treasuries' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'ETF', description: 'Gold bullion' },
  { symbol: 'SLV', name: 'iShares Silver Trust', type: 'ETF', description: 'Silver bullion' },
  { symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF', type: 'ETF', dividendYield: 1.8, description: 'Dividend growth stocks' },
  { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', type: 'ETF', dividendYield: 3.5, description: 'High dividend stocks' },
  { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', type: 'ETF', dividendYield: 3.0, description: 'High dividend stocks' },

  // ===== MAJOR INDICES (as tracking ETFs/symbols people search) =====
  { symbol: '^GSPC', name: 'S&P 500 Index', type: 'INDEX', description: '500 largest US companies' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', type: 'INDEX', description: '30 blue-chip stocks' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', type: 'INDEX', description: 'All NASDAQ stocks' },
  { symbol: '^RUT', name: 'Russell 2000 Index', type: 'INDEX', description: 'Small-cap stocks' },

  // ===== GAMING & ENTERTAINMENT =====
  { symbol: 'ATVI', name: 'Activision Blizzard', type: 'EQUITY', sector: 'Communication Services', description: 'Video game company' },
  { symbol: 'EA', name: 'Electronic Arts', type: 'EQUITY', sector: 'Communication Services', dividendYield: 0.5, description: 'Video game company' },
  { symbol: 'TTWO', name: 'Take-Two Interactive', type: 'EQUITY', sector: 'Communication Services', description: 'Video game company (GTA)' },
  { symbol: 'GME', name: 'GameStop Corp.', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Video game retailer' },
  { symbol: 'AMC', name: 'AMC Entertainment', type: 'EQUITY', sector: 'Communication Services', description: 'Movie theaters' },
  { symbol: 'LYV', name: 'Live Nation Entertainment', type: 'EQUITY', sector: 'Communication Services', description: 'Concerts and events' },

  // ===== ELECTRIC VEHICLES & CLEAN ENERGY =====
  { symbol: 'RIVN', name: 'Rivian Automotive', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Electric vehicle maker' },
  { symbol: 'LCID', name: 'Lucid Group', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Luxury electric vehicles' },
  { symbol: 'NIO', name: 'NIO Inc.', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Chinese electric vehicles' },
  { symbol: 'F', name: 'Ford Motor Company', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 4.5, description: 'Automaker' },
  { symbol: 'GM', name: 'General Motors', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 1.0, description: 'Automaker' },
  { symbol: 'ENPH', name: 'Enphase Energy', type: 'EQUITY', sector: 'Technology', description: 'Solar microinverters' },
  { symbol: 'SEDG', name: 'SolarEdge Technologies', type: 'EQUITY', sector: 'Technology', description: 'Solar inverters' },
  { symbol: 'FSLR', name: 'First Solar', type: 'EQUITY', sector: 'Technology', description: 'Solar panels' },
  { symbol: 'PLUG', name: 'Plug Power', type: 'EQUITY', sector: 'Industrials', description: 'Hydrogen fuel cells' },

  // ===== AIRLINES & TRAVEL =====
  { symbol: 'DAL', name: 'Delta Air Lines', type: 'EQUITY', sector: 'Industrials', dividendYield: 1.0, description: 'Major airline' },
  { symbol: 'UAL', name: 'United Airlines', type: 'EQUITY', sector: 'Industrials', description: 'Major airline' },
  { symbol: 'AAL', name: 'American Airlines', type: 'EQUITY', sector: 'Industrials', description: 'Major airline' },
  { symbol: 'LUV', name: 'Southwest Airlines', type: 'EQUITY', sector: 'Industrials', dividendYield: 2.0, description: 'Low-cost airline' },
  { symbol: 'BKNG', name: 'Booking Holdings', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Travel booking (Booking.com)' },
  { symbol: 'ABNB', name: 'Airbnb Inc.', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Home-sharing platform' },
  { symbol: 'MAR', name: 'Marriott International', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 1.0, description: 'Hotel chain' },
  { symbol: 'HLT', name: 'Hilton Worldwide', type: 'EQUITY', sector: 'Consumer Cyclical', dividendYield: 0.4, description: 'Hotel chain' },

  // ===== ADDITIONAL POPULAR NAMES =====
  { symbol: 'COIN', name: 'Coinbase Global', type: 'EQUITY', sector: 'Financial Services', description: 'Cryptocurrency exchange' },
  { symbol: 'HOOD', name: 'Robinhood Markets', type: 'EQUITY', sector: 'Financial Services', description: 'Trading app' },
  { symbol: 'SOFI', name: 'SoFi Technologies', type: 'EQUITY', sector: 'Financial Services', description: 'Digital banking' },
  { symbol: 'WBD', name: 'Warner Bros. Discovery', type: 'EQUITY', sector: 'Communication Services', description: 'Media and entertainment' },
  { symbol: 'PARA', name: 'Paramount Global', type: 'EQUITY', sector: 'Communication Services', dividendYield: 1.0, description: 'Media company' },
  { symbol: 'ROKU', name: 'Roku Inc.', type: 'EQUITY', sector: 'Technology', description: 'Streaming devices' },
  { symbol: 'ETSY', name: 'Etsy Inc.', type: 'EQUITY', sector: 'Consumer Cyclical', description: 'Handmade marketplace' },
  { symbol: 'DASH', name: 'DoorDash Inc.', type: 'EQUITY', sector: 'Technology', description: 'Food delivery' },
  { symbol: 'PATH', name: 'UiPath Inc.', type: 'EQUITY', sector: 'Technology', description: 'Automation software' },
  { symbol: 'DDOG', name: 'Datadog Inc.', type: 'EQUITY', sector: 'Technology', description: 'Cloud monitoring' },
  { symbol: 'SNOW', name: 'Snowflake Inc.', type: 'EQUITY', sector: 'Technology', description: 'Cloud data platform' },
  { symbol: 'CRWD', name: 'CrowdStrike Holdings', type: 'EQUITY', sector: 'Technology', description: 'Cybersecurity' },
  { symbol: 'ZS', name: 'Zscaler Inc.', type: 'EQUITY', sector: 'Technology', description: 'Cloud security' },
  { symbol: 'NET', name: 'Cloudflare Inc.', type: 'EQUITY', sector: 'Technology', description: 'Web infrastructure' },
  { symbol: 'PANW', name: 'Palo Alto Networks', type: 'EQUITY', sector: 'Technology', description: 'Cybersecurity' },
  { symbol: 'FTNT', name: 'Fortinet Inc.', type: 'EQUITY', sector: 'Technology', dividendYield: 0.0, description: 'Cybersecurity' },
];

/**
 * Search the local stock database
 * Performs fuzzy matching on symbol and name
 */
export function searchLocalStocks(query: string): LocalStock[] {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) return [];

  // Score each stock based on match quality
  const scored = STOCK_DATABASE.map(stock => {
    let score = 0;
    const symbolLower = stock.symbol.toLowerCase();
    const nameLower = stock.name.toLowerCase();

    // Exact symbol match (highest priority)
    if (symbolLower === searchTerm) {
      score = 1000;
    }
    // Symbol starts with query
    else if (symbolLower.startsWith(searchTerm)) {
      score = 500 + (100 - symbolLower.length); // Shorter symbols rank higher
    }
    // Symbol contains query
    else if (symbolLower.includes(searchTerm)) {
      score = 200;
    }
    // Name starts with query word
    else if (nameLower.startsWith(searchTerm) || nameLower.includes(` ${searchTerm}`)) {
      score = 150;
    }
    // Name contains query
    else if (nameLower.includes(searchTerm)) {
      score = 100;
    }
    // Description contains query
    else if (stock.description?.toLowerCase().includes(searchTerm)) {
      score = 50;
    }
    // Sector matches
    else if (stock.sector?.toLowerCase().includes(searchTerm)) {
      score = 25;
    }

    return { stock, score };
  });

  // Filter to matches only, sort by score descending, return top 15
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(s => s.stock);
}

/**
 * Get a stock by exact symbol
 */
export function getLocalStock(symbol: string): LocalStock | undefined {
  const symbolUpper = symbol.toUpperCase().trim();
  return STOCK_DATABASE.find(s => s.symbol === symbolUpper);
}

/**
 * Check if a symbol exists in the local database
 */
export function isLocalStock(symbol: string): boolean {
  return getLocalStock(symbol) !== undefined;
}
