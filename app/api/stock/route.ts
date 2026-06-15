import { NextRequest, NextResponse } from 'next/server'
import { fetchTwelveDataQuote, fetchYahooQuote, fetchStooqHistory, fetchYahooHistory, fetchFinnhub, fetchSECCompanyFacts, fetchCIK, fetchOpenFIGI } from '@/lib/api-utils'
import { getCache, setCache } from '@/lib/cache'

async function resolveQuote(ticker: string) {
  const key = `stock:quote:${ticker}`
  const cached = getCache(key)
  if (cached) return cached

  let q: any

  q = await fetchTwelveDataQuote(ticker).catch(() => null)
  if (q?.price) { setCache(key, q, 120); return q }

  try {
    const fq = await fetchFinnhub(`/quote?symbol=${ticker}`)
    if (fq?.c != null) {
      q = { price: fq.c, change: fq.d, changePercent: fq.dp, dayHigh: fq.h, dayLow: fq.l, volume: fq.v, previousClose: fq.pc, name: ticker }
      setCache(key, q, 120)
      return q
    }
  } catch {}

  try {
    const yq = await fetchYahooQuote(ticker)
    if (yq?.price) { setCache(key, yq, 120); return yq }
  } catch {}

  return getCache(key)
}

async function resolveCompany(ticker: string) {
  try {
    const p = await fetchFinnhub(`/stock/profile2?symbol=${ticker}`)
    if (p?.name) {
      return {
        name: p.name, sector: p.sector || null, industry: p.industry || null,
        description: null, employees: null,
        website: p.weburl || null, cik: null,
        beta: null,
        headquarters: null,
      }
    }
  } catch {}

  try {
    const figi = await fetchOpenFIGI(ticker)
    if (figi?.name) {
      return { name: figi.name, sector: null, industry: null, description: null, employees: null, website: null, cik: null, beta: null, headquarters: null }
    }
  } catch {}

  try {
    const cik = await fetchCIK(ticker)
    if (cik) {
      return { name: ticker, sector: null, industry: null, description: null, employees: null, website: null, cik, beta: null, headquarters: null }
    }
  } catch {}

  return { name: ticker, sector: null, industry: null, description: null, employees: null, website: null, cik: null, beta: null, headquarters: null }
}

async function resolveHistory(ticker: string, range: string) {
  const key = `stock:history:${ticker}:${range}`
  const cached = getCache(key)
  if (cached) return cached

  let h: any

  h = await fetchStooqHistory(ticker).catch(() => null)
  if (h?.length) { setCache(key, h, 3600); return h }

  h = await fetchYahooHistory(ticker, range).catch(() => null)
  if (h?.length) { setCache(key, h, 3600); return h }

  try {
    const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1day&outputsize=${range === '5y' ? 1250 : 365}&apikey=${process.env.TWELVE_DATA_KEY || ''}`, { signal: AbortSignal.timeout(8000) })
    if (res.ok) {
      const d = await res.json()
      if (d?.values?.length) {
        h = d.values.map((v: any) => ({ timestamp: new Date(v.datetime).getTime() / 1000, price: parseFloat(v.close), volume: parseInt(v.volume) || 0 })).reverse()
        setCache(key, h, 3600)
        return h
      }
    }
  } catch {}

  return []
}

async function resolveFundamentals(ticker: string, quote: any) {
  const key = `stock:fundamentals:${ticker}`
  const cached = getCache(key)
  if (cached) return cached

  try {
    const mm = await fetchFinnhub(`/stock/metric?symbol=${ticker}&metric=all`)
    const m = mm?.metric
    if (m) {
      const out = {
        marketCap: quote?.marketCap || m.marketCapitalization || null,
        peRatio: m.peTTM || null, forwardPe: m.forwardPE || null,
        pegRatio: m.pegRatio || null, priceToSales: m.priceSalesTTM || null,
        priceToBook: m.priceBookTTM || null, evRevenue: m.evRevenueTTM || null,
        evEbitda: m.evEBITDATTM || null, dividendYield: m.dividendYieldIndicatedAnnual || null,
        eps: m.epsTTM || null,
      }
      setCache(key, out, 3600)
      return out
    }
  } catch {}

  return null
}

async function resolveFinancials(ticker: string, cik: string | null) {
  const key = `stock:financials:${ticker}`
  const cached = getCache(key)
  if (cached) return cached

  if (cik) {
    try {
      const facts = await fetchSECCompanyFacts(cik)
      if (facts?.facts?.usDollarBasedReporting?.gaap) {
        const gp = facts.facts.usDollarBasedReporting.gaap
        const out = {
          revenue: gp.RevenueFromContractWithCustomerExcludingAssessedTax?.units?.USD?.[0]?.val || gp.Revenues?.units?.USD?.[0]?.val || null,
          revenueGrowth: null, grossMargin: null, operatingMargin: null,
          profitMargin: null, returnOnEquity: null,
          freeCashFlow: gp.NetCashProvidedByOperatingActivities?.units?.USD?.[0]?.val || null,
          debtToEquity: null,
        }
        setCache(key, out, 3600)
        return out
      }
    } catch {}
  }

  try {
    const mm = await fetchFinnhub(`/stock/metric?symbol=${ticker}&metric=all`)
    const m = mm?.metric
    if (m?.revenue || m?.revenueGrowth) {
      const out = {
        revenue: m.revenue || null, revenueGrowth: m.revenueGrowth || null,
        grossMargin: m.grossMargin || null, operatingMargin: m.operatingMargin || null,
        profitMargin: m.netProfitMargin || null, returnOnEquity: m.roe || null,
        freeCashFlow: m.freeCashFlow || null, debtToEquity: m.debtToEquity || null,
      }
      setCache(key, out, 3600)
      return out
    }
  } catch {}

  return null
}

async function resolveAnalysts(ticker: string) {
  try {
    const [ratings, target] = await Promise.all([
      fetchFinnhub(`/stock/recommendation?symbol=${ticker}`),
      fetchFinnhub(`/stock/price-target?symbol=${ticker}`),
    ])
    const list = Array.isArray(ratings) ? ratings : []
    const numBuy = list.filter((r: any) => r.action === 'buy' || r.action === 'strongBuy').length
    const numHold = list.filter((r: any) => r.action === 'hold' || r.action === 'neutral').length
    const numSell = list.filter((r: any) => r.action === 'sell' || r.action === 'strongSell').length
    const total = numBuy + numHold + numSell
    return {
      recommendationScore: target?.lastScore || null,
      targetPrice: target?.targetHigh || target?.targetMedian || null,
      targetLow: target?.targetLow || null,
      targetHigh: target?.targetHigh || null,
      numberOfAnalysts: total || null,
      numBuy, numHold, numSell,
    }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker')?.toUpperCase()
  const range = searchParams.get('range') || '1y'

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 })
  }

  const [quote, companyInfo, history] = await Promise.all([
    resolveQuote(ticker),
    resolveCompany(ticker),
    resolveHistory(ticker, range),
  ])

  const cik = companyInfo?.cik || null

  const [financials, fundamentals, analysts] = await Promise.all([
    resolveFinancials(ticker, cik),
    resolveFundamentals(ticker, quote),
    resolveAnalysts(ticker),
  ])

  return NextResponse.json({
    company: {
      ticker,
      name: companyInfo?.name || ticker,
      sector: companyInfo?.sector || null,
      industry: companyInfo?.industry || null,
      description: companyInfo?.description || null,
      employees: companyInfo?.employees || null,
      website: companyInfo?.website || null,
      headquarters: companyInfo?.headquarters || null,
    },
    price: {
      current: quote?.price ?? null,
      change: quote?.change ?? null,
      changePercent: quote?.changePercent ?? null,
      dayLow: quote?.dayLow ?? null,
      dayHigh: quote?.dayHigh ?? null,
      low52w: quote?.low52w ?? null,
      high52w: quote?.high52w ?? null,
      volume: quote?.volume ?? null,
      previousClose: quote?.previousClose ?? null,
    },
    fundamentals: {
      marketCap: fundamentals?.marketCap ?? null,
      peRatio: fundamentals?.peRatio ?? null,
      forwardPe: fundamentals?.forwardPe ?? null,
      pegRatio: fundamentals?.pegRatio ?? null,
      priceToSales: fundamentals?.priceToSales ?? null,
      priceToBook: fundamentals?.priceToBook ?? null,
      evRevenue: fundamentals?.evRevenue ?? null,
      evEbitda: fundamentals?.evEbitda ?? null,
      dividendYield: fundamentals?.dividendYield ?? null,
      beta: companyInfo?.beta ?? null,
      eps: fundamentals?.eps ?? null,
    },
    analysts: {
      recommendationScore: analysts?.recommendationScore ?? null,
      targetPrice: analysts?.targetPrice ?? null,
      targetLow: analysts?.targetLow ?? null,
      targetHigh: analysts?.targetHigh ?? null,
      numberOfAnalysts: analysts?.numberOfAnalysts ?? null,
      numBuy: analysts?.numBuy ?? 0,
      numHold: analysts?.numHold ?? 0,
      numSell: analysts?.numSell ?? 0,
    },
    financials: {
      revenue: financials?.revenue ?? null,
      revenueGrowth: financials?.revenueGrowth ?? null,
      grossMargin: financials?.grossMargin ?? null,
      operatingMargin: financials?.operatingMargin ?? null,
      profitMargin: financials?.profitMargin ?? null,
      returnOnEquity: financials?.returnOnEquity ?? null,
      freeCashFlow: financials?.freeCashFlow ?? null,
      debtToEquity: financials?.debtToEquity ?? null,
    },
    priceHistory: history || [],
  })
}
