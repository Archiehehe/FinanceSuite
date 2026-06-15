# Archie's FinanceSuite

Personal finance toolbox — six embedded tools in a single dark-themed dashboard.

## Tools

| Tool | Description |
|------|-------------|
| **SnapJudgement** | Enter any ticker → structured investment brief with valuation, sentiment, financials, and price behavior |
| **Market Narrative** | Translates price action into structured narratives with sector and regime context |
| **DipSnipe** | Identify daily stock market losers across sectors, industries, and market-cap ranges |
| **ATH Distance** | Measures how far stocks are from all-time highs, broken down by sector and industry |
| **Sector Momentum** | Track sector rotation with relative strength, volatility, and RSI metrics |
| **Portfolio Merger** | Upload multiple portfolio files (CSV/XLSX), combine by ticker with live P&L and charts |

## Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Radix UI
- **APIs:** Finnhub, Twelve Data, Alpha Vantage, Yahoo Finance, Stooq, FRED, CoinGecko, SEC EDGAR, OpenFIGI, OpenRouter, Gemini
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
