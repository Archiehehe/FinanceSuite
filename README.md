# Archie's FinanceSuite

A unified collection of financial analysis tools — stock research, peer comparison, earnings intelligence, market narratives, sector momentum, and more. All data fetched live from multiple APIs.

**Live:** [archiefinancesuite.vercel.app](https://archiefinancesuite.vercel.app/)

## Tools

| Tool | Description |
|------|-------------|
| **Earnings Intel** | Earnings calendar & insider tracking — track reports, estimates, price reactions, and insider transactions |
| **Sector Momentum** | Sector rotation across GICS sectors and thematic baskets with relative strength, volatility, and RSI |
| **SnapJudgement** | Enter any ticker → structured investment brief with valuation, sentiment, financials, and price behavior |
| **Market Narrative** | Translates price action into structured narratives with sector and regime context |
| **DipSnipe** | Identify and analyze daily stock market losers across sectors, industries, and market-cap ranges |
| **Supply Atlas** | Map the end-to-end economic chain behind any investable subtheme — companies, products, regions, and risks |
| **WallStreetScout** | AI-powered financial news feed, curated baskets, watchlist tracking, and summarised market intelligence |
| **ThesisPath** | Structured equity research, one subtheme at a time — curated universe with AI-backed question packs |
| **SuperInvestor Lab** | Analyze stocks through 25+ legendary investors — Graham, Buffett, Lynch, and more |
| **Peer Comparison** | Compare company valuation multiples against S&P 500 peers by sector and industry |
| **ATH Distance** | Distance from all-time highs, broken down by sector and industry with filters |
| **Portfolio Merger** | Upload multiple portfolio files (CSV/XLSX), combine by ticker with live P&L, donut charts, and PDF reports |

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Radix UI, Lucide React, Recharts, Sonner
- **APIs:** Alpha Vantage, Finnhub, Twelve Data, Yahoo Finance, Stooq, FRED, CoinGecko, SEC EDGAR, OpenFIGI, GDELT, OpenRouter, Gemini
- **Data Sources (UI):** Financial Modeling Prep, Polygon.io, NASDAQ, MarketBeat, SimFin, Sentisense, GuruFocus, Groq AI
- **Hosting:** Vercel

## Environment Variables

Required (set in Vercel):

```
ALPHA_VANTAGE_KEY=
FINNHUB_KEY=
TWELVE_DATA_KEY=
FRED_KEY=
GEMINI_KEY=
OPENROUTER_KEY=
```

## Local Development

```bash
npm install
npm run dev
```
