import { NextRequest, NextResponse } from 'next/server'
import { fetchFinnhub, fetchYahooQuote } from '@/lib/api-utils'

const TOP_TICKERS = ['AAPL','NVDA','MSFT','GOOGL','AMZN','META','TSLA','AVGO','JPM','V','LLY','XOM','UNH','ORCL','PG','COST','HD','MA','BAC','CRM','NFLX','WMT','AMD','CVX','KO','ADBE','MRK','ABBV','PEP','TMO','AXP','QCOM','TMUS','WFC','DIS','CSCO','INTU','AMGN','CAT','VZ','IBM','BX','MS','UBER','NEE','GE','TXN','SPGI','CMCSA','GS','RTX','HON','ISRG','LOW','PLD','UNP','BKNG','AMAT','BLK','SYK','MDT','LMT','TJX','ELV','ETN','PFE','MU','AMT','BSX','CI','SCHW','DE','MMC','CB','GILD','SO','DUK','REGN','ADP','CL','WM','NKE','SHW','BA','TT','ECL','ICE','CTAS','ZTS','MCO','MCK','HLT','EOG','PNC','APD','MO','GD','BDX','AON','ITW','NOC','TGT','CME','MAR','PYPL','USB','FDX']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const portfolioTickers = searchParams.get('portfolio')?.split(',').map(t => t.trim().toUpperCase()).filter(Boolean) || []

  const allTickers = Array.from(new Set([...TOP_TICKERS, ...portfolioTickers]))
  if (allTickers.length === 0) return NextResponse.json([])

  const finnhubResults = await Promise.allSettled(
    allTickers.slice(0, 100).map(async (t) => {
      const q = await fetchFinnhub(`/quote?symbol=${t}`)
      if (q && q.c != null) {
        return { ticker: t, price: q.c, change: q.d, changePercent: q.dp }
      }
      throw new Error(`No data for ${t}`)
    })
  )

  const valid = finnhubResults
    .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
    .map(r => r.value)

  if (valid.length > 0) {
    return NextResponse.json(valid)
  }

  const results = []
  for (const t of allTickers.slice(0, 20)) {
    try {
      const y = await fetchYahooQuote(t)
      if (y) {
        results.push({ ticker: t, price: y.price, change: y.change, changePercent: y.changePercent })
      }
    } catch {}
  }

  return NextResponse.json(results)
}
