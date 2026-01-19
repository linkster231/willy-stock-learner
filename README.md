# Willy Stock Learner

A bilingual (English/Spanish) Progressive Web App (PWA) designed to teach stock market fundamentals through interactive lessons, quizzes, a glossary with spaced repetition, and paper trading simulation.

## Features

- **Interactive Lessons**: Step-by-step curriculum covering stock market basics
- **Quizzes**: Test knowledge with multiple-choice questions after each lesson
- **Glossary with Spaced Repetition**: Learn financial terms with a smart review system
- **Paper Trading**: Practice trading with $100,000 virtual money
- **Bilingual Support**: Full English and Spanish translations
- **Progressive Web App**: Install on any device for offline access
- **Mobile-First Design**: Optimized for phones and tablets

---

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Installing on Your Phone

### iPhone / iPad (iOS)

1. **Open Safari** (must use Safari, not Chrome or other browsers)
2. **Navigate to the app URL** (e.g., `https://your-app-domain.com`)
3. **Tap the Share button** (square with arrow pointing up at the bottom of the screen)
4. **Scroll down and tap "Add to Home Screen"**
5. **Name the app** (default: "Stock Learner") and tap **Add**
6. **Find the app icon** on your home screen and tap to open

The app will now run in full-screen mode like a native app!

**Tips for iOS:**
- The app works offline once installed
- Updates happen automatically when you open the app with internet
- To uninstall, press and hold the icon, then tap "Remove App"

### Android Phone / Tablet

#### Method 1: Chrome Browser (Recommended)

1. **Open Chrome browser**
2. **Navigate to the app URL** (e.g., `https://your-app-domain.com`)
3. **Look for the install prompt** - Chrome may show a banner saying "Add Stock Learner to Home screen"
4. **If no banner appears**, tap the **three dots menu** (⋮) in the top right
5. **Tap "Add to Home screen"** or "Install app"
6. **Tap "Install"** in the confirmation dialog
7. **Find the app icon** on your home screen

#### Method 2: Samsung Internet Browser

1. **Open Samsung Internet**
2. **Navigate to the app URL**
3. **Tap the menu icon** (three lines)
4. **Tap "Add page to"** → **"Home screen"**
5. **Tap "Add"**

**Tips for Android:**
- The app will appear in your app drawer like any other app
- You can manage it from Settings → Apps
- Notifications and offline mode work automatically
- To uninstall, press and hold the icon, then drag to "Uninstall"

---

## Curriculum Overview

The Stock Learner curriculum is designed for complete beginners and progresses from basic concepts to practical trading knowledge.

### Module 1: Getting Started

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| 1.1 | What is a Stock? | Stocks represent ownership in companies; shareholders own pieces of businesses |
| 1.2 | Why Companies Sell Stock | Companies sell stock to raise money for growth without taking loans |
| 1.3 | How Stock Prices Change | Supply and demand determine prices; more buyers = higher prices |
| 1.4 | Stock Exchanges | NYSE and NASDAQ are marketplaces where stocks are bought and sold |
| 1.5 | Reading Stock Quotes | Understanding ticker symbols, prices, and daily changes |

**Quiz**: 5 questions testing understanding of basic stock concepts

### Module 2: Types of Investments (Coming Soon)

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| 2.1 | Common vs Preferred Stock | Different types of stock ownership and their benefits |
| 2.2 | What are Bonds? | Loans to companies/governments that pay interest |
| 2.3 | Mutual Funds | Pooled investments managed by professionals |
| 2.4 | ETFs (Exchange-Traded Funds) | Baskets of stocks that trade like single stocks |
| 2.5 | Index Funds | Funds that track market indexes like S&P 500 |

### Module 3: Making Money with Stocks (Coming Soon)

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| 3.1 | Capital Gains | Making money when stock prices go up |
| 3.2 | Dividends | Regular payments companies make to shareholders |
| 3.3 | Compound Growth | How reinvesting grows your money faster |
| 3.4 | Dollar-Cost Averaging | Strategy of investing regularly over time |
| 3.5 | Long-Term vs Short-Term | Benefits of patience in investing |

### Module 4: Understanding Risk (Coming Soon)

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| 4.1 | What is Risk? | Possibility of losing money; higher risk = potentially higher reward |
| 4.2 | Diversification | Don't put all eggs in one basket |
| 4.3 | Market Volatility | Why prices go up and down |
| 4.4 | Risk Tolerance | Understanding your comfort with risk |
| 4.5 | Protecting Your Investments | Strategies to minimize losses |

### Module 5: How to Start Investing (Coming Soon)

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| 5.1 | Brokerage Accounts | Where to buy and sell stocks |
| 5.2 | Types of Orders | Market orders, limit orders, stop orders |
| 5.3 | Building a Portfolio | Creating a balanced mix of investments |
| 5.4 | When to Buy and Sell | Timing and strategy considerations |
| 5.5 | Investing Mistakes to Avoid | Common pitfalls and how to avoid them |

---

## Glossary System

The glossary uses **spaced repetition** to help memorize financial terms effectively.

### How It Works

1. **Browse Terms**: View all financial terms with kid-friendly definitions
2. **Add to My Words**: Save terms you want to learn
3. **Review Sessions**: Practice with flashcard-style reviews
4. **Smart Scheduling**: Terms you know well appear less often; difficult terms appear more frequently

### Spaced Repetition Algorithm

- **New words**: Review after 1 day
- **After correct answer**: Double the interval (1 → 2 → 4 → 8 days)
- **After incorrect answer**: Reset to 1 day
- **Mastered words**: Review every 30+ days

### Sample Terms Included

| Term | Kid-Friendly Definition |
|------|------------------------|
| Stock | A tiny piece of a company you can own |
| Dividend | Money a company shares with people who own its stock |
| Portfolio | A collection of all your investments, like a basket |
| Bull Market | When stock prices keep going up (bulls charge up!) |
| Bear Market | When stock prices keep going down (bears swipe down!) |
| IPO | When a company sells stock to the public for the first time |

---

## Paper Trading

Practice trading with **$100,000 in virtual money** - no real money needed!

### Features

- **Real Stock Data**: Uses actual market prices (15-minute delay)
- **Buy & Sell**: Execute trades just like real trading
- **Portfolio Tracking**: See your holdings and total value
- **Performance Metrics**: Track your gains and losses
- **Transaction History**: Review all your trades

### How to Use

1. **Search for a stock** by company name or ticker symbol
2. **View the current price** and stock information
3. **Enter the number of shares** you want to buy
4. **Confirm your order** to execute the trade
5. **Track your portfolio** to see how your investments perform

### Reset Policy

- You get **3 portfolio resets** total
- Resets restore your balance to $100,000
- Use resets wisely - they're limited!
- Request additional resets if needed (requires approval)

---

## Technical Details

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **PWA**: next-pwa with Workbox
- **State Management**: Zustand with persistence
- **Stock Data**: Alpha Vantage API

### Project Structure

```
src/
├── app/
│   └── [locale]/          # Locale-specific pages
│       ├── learn/         # Lessons and quizzes
│       ├── glossary/      # Glossary and flashcards
│       ├── trade/         # Paper trading
│       └── page.tsx       # Home page
├── components/
│   ├── ui/                # Reusable UI components
│   ├── learn/             # Lesson components
│   ├── glossary/          # Glossary components
│   └── trading/           # Trading components
├── stores/                # Zustand state stores
├── lib/                   # Utilities and helpers
└── i18n/                  # Internationalization config

messages/
├── en.json                # English translations
└── es.json                # Spanish translations
```

### Environment Variables

Create a `.env.local` file:

```env
# Alpha Vantage API key for stock data
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here
```

Get a free API key at: https://www.alphavantage.co/support/#api-key

### Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

### Deploying

The app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended): Connect your GitHub repo for automatic deployments
- **Netlify**: Use the Next.js adapter
- **Self-hosted**: Run `npm run build && npm start`

For the PWA to work properly, the app **must be served over HTTPS**.

---

## Customization

### Adding New Lessons

1. Add lesson content to `messages/en.json` and `messages/es.json`
2. Update the lesson rendering in `src/components/learn/`
3. Add quiz questions in the translations

### Adding Glossary Terms

Add terms to the `glossary.terms` object in both translation files:

```json
{
  "glossary": {
    "terms": {
      "newTerm": {
        "term": "New Term",
        "definition": "Kid-friendly definition here",
        "example": "Example of how it's used"
      }
    }
  }
}
```

### Changing the Theme

Edit `tailwind.config.ts` to customize colors, fonts, and other design tokens.

---

## License

MIT License - feel free to use and modify for educational purposes.

---

## Support

For questions or issues, please open a GitHub issue or contact the development team.
