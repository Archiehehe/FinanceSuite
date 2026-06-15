import { getCache, setCache } from './cache'

const ALPHA_KEY = process.env.ALPHA_VANTAGE_KEY || ''
const FINNHUB_KEY = process.env.FINNHUB_KEY || ''
const TWELVE_KEY = process.env.TWELVE_DATA_KEY || ''
const FRED_KEY = process.env.FRED_KEY || ''
const GEMINI_KEY = process.env.GEMINI_KEY || ''
const OPENROUTER_KEY = process.env.OPENROUTER_KEY || ''

function uc(t: string) { return t.toUpperCase().trim() }

/* ─── helpers ─── */
async function jsonFetch(url: string, init?: RequestInit, timeoutMs = 4000) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), ...init })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

async function textFetch(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) return null
    return res.text()
  } catch { return null }
}

/* ─── Alpha Vantage ─── */
export async function fetchAlphaVantage(path: string) {
  const cached = getCache(`av:${path}`)
  if (cached) return cached
  const data = await jsonFetch(`https://www.alphavantage.co/query?${path}&apikey=${ALPHA_KEY}`)
  if (data) setCache(`av:${path}`, data, 300)
  return data
}

/* ─── Finnhub ─── */
export async function fetchFinnhub(path: string) {
  const cached = getCache(`finn:${path}`)
  if (cached) return cached
  const connector = path.includes('?') ? '&' : '?'
  const data = await jsonFetch(`https://finnhub.io/api/v1${path}${connector}token=${FINNHUB_KEY}`)
  if (data) setCache(`finn:${path}`, data, 300)
  return data
}

/* ─── Twelve Data ─── */
export async function fetchTwelveData(path: string) {
  const cached = getCache(`tw:${path}`)
  if (cached) return cached
  const data = await jsonFetch(`https://api.twelvedata.com${path}&apikey=${TWELVE_KEY}`)
  if (data) setCache(`tw:${path}`, data, 300)
  return data
}

export async function fetchTwelveDataQuote(ticker: string) {
  const d = await fetchTwelveData(`/quote?symbol=${uc(ticker)}`)
  if (!d || d.status === 'error') return null
  return {
    price: parseFloat(d.close) || null,
    change: parseFloat(d.change) || null,
    changePercent: parseFloat(d.percent_change) || null,
    dayHigh: parseFloat(d.high) || null,
    dayLow: parseFloat(d.low) || null,
    volume: parseInt(d.volume) || null,
    previousClose: parseFloat(d.previous_close) || null,
    name: d.name || ticker,
  }
}

export async function fetchTwelveDataHistory(ticker: string, interval = '1day', output = 365) {
  const d = await fetchTwelveData(`/time_series?symbol=${uc(ticker)}&interval=${interval}&outputsize=${output}`)
  const values = d?.values || []
  return values.map((v: any) => ({
    timestamp: new Date(v.datetime).getTime() / 1000,
    price: parseFloat(v.close),
    volume: parseInt(v.volume) || 0,
  })).reverse().filter((d: any) => d.price != null && !isNaN(d.price))
}

/* ─── FRED ─── */
export async function fetchFRED(series: string, limit = 120) {
  const cached = getCache(`fred:${series}`)
  if (cached) return cached
  const d = await jsonFetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${series}&api_key=${FRED_KEY}&file_type=json&sort_order=desc&limit=${limit}`)
  if (d?.observations) setCache(`fred:${series}`, d, 7200)
  return d
}

/* ─── Yahoo (unofficial, no key) ─── */
export async function fetchYahooQuote(ticker: string) {
  const cached = getCache(`yhq:${ticker}`)
  if (cached) return cached
  const d = await jsonFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${uc(ticker)}?range=1mo&interval=1d`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const r = d?.chart?.result?.[0]
  if (!r?.meta) return null
  const q = r.indicators?.quote?.[0]
  const closes: number[] = []
  for (let i = 0; i < (r.timestamp || []).length; i++) {
    if (q?.close?.[i] != null) closes.push(q.close[i])
  }
  const cur = r.meta.regularMarketPrice || closes[closes.length - 1]
  const prev = closes.length > 1 ? closes[closes.length - 2] : cur
  const out = {
    price: cur, change: cur - prev, changePercent: prev ? ((cur - prev) / prev) * 100 : 0,
    previousClose: prev, dayHigh: r.meta.regularMarketDayHigh, dayLow: r.meta.regularMarketDayLow,
    volume: r.meta.regularMarketVolume, name: r.meta.shortName || r.meta.longName || ticker,
    marketCap: r.meta.marketCap,
  }
  setCache(`yhq:${ticker}`, out, 120)
  return out
}

export async function fetchYahooSummary(ticker: string) {
  const cached = getCache(`yhs:${ticker}`)
  if (cached) return cached
  const d = await jsonFetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${uc(ticker)}?modules=defaultKeyStatistics%2CfinancialData%2CsummaryDetail`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, 8000)
  const q = d?.quoteSummary?.result?.[0]
  if (!q) return null
  const ks = q.defaultKeyStatistics ?? {}
  const fd = q.financialData ?? {}
  const sd = q.summaryDetail ?? {}
  const out = {
    beta: ks.beta?.raw ?? null,
    forwardPe: ks.forwardPE?.raw ?? null,
    pegRatio: ks.pegRatio?.raw ?? null,
    marketCap: fd.marketCap?.raw ?? ks.marketCap?.raw ?? null,
    enterpriseValue: fd.enterpriseValue?.raw ?? null,
    revenue: fd.totalRevenue?.raw ?? null,
    revenueGrowth: fd.revenueGrowth?.raw ?? null,
    grossMargin: fd.grossMargins?.raw ?? null,
    operatingMargin: fd.operatingMargins?.raw ?? null,
    netMargin: fd.profitMargins?.raw ?? null,
    roe: fd.returnOnEquity?.raw ?? null,
    roa: fd.returnOnAssets?.raw ?? null,
    debtToEquity: fd.debtToEquity?.raw ?? sd.debtToEquity?.raw ?? null,
    currentRatio: fd.currentRatio?.raw ?? sd.currentRatio?.raw ?? null,
    quickRatio: fd.quickRatio?.raw ?? sd.quickRatio?.raw ?? null,
    dividendYield: sd.dividendYield?.raw ?? fd.dividendYield?.raw ?? null,
    eps: fd.earningsPerShare?.raw ?? ks.earningsPerShare?.raw ?? null,
    sharesOut: ks.sharesOutstanding?.raw ?? null,
    bookValue: ks.bookValue?.raw ?? null,
    priceToBook: ks.priceToBook?.raw ?? fd.priceToBook?.raw ?? null,
    sector: sd.sector ?? fd.sector ?? null,
    industry: sd.industry ?? fd.industry ?? null,
  }
  setCache(`yhs:${ticker}`, out, 3600)
  return out
}

export async function fetchYahooHistory(ticker: string, range = '1y') {
  const cached = getCache(`yhh:${ticker}:${range}`)
  if (cached) return cached
  const d = await jsonFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${uc(ticker)}?range=${range}&interval=1d`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const r = d?.chart?.result?.[0]
  if (!r?.timestamp) return null
  const q = r.indicators?.quote?.[0]
  const out = r.timestamp.map((t: number, i: number) => ({ timestamp: t, price: q?.close?.[i] ?? null, volume: q?.volume?.[i] ?? null })).filter((x: any) => x.price != null)
  if (out.length) setCache(`yhh:${ticker}:${range}`, out, 3600)
  return out
}

/* ─── Stooq (free, unlimited, no key, EOD CSV) ─── */
export async function fetchStooqHistory(ticker: string) {
  const cached = getCache(`stooq:${ticker}`)
  if (cached) return cached
  const csv = await textFetch(`https://stooq.com/q/d/l/?s=${ticker.toLocaleLowerCase()}.us&i=d`)
  if (!csv) return null
  const lines = csv.trim().split('\n').slice(1).filter(Boolean)
  const out = lines.map(l => {
    const [date, open, high, low, close, volume] = l.split(',')
    const price = parseFloat(close)
    return { timestamp: new Date(date).getTime() / 1000, price: isNaN(price) ? null : price, volume: parseInt(volume) || 0 }
  }).filter((d: any) => d.price != null).reverse()
  if (out.length > 5) setCache(`stooq:${ticker}`, out, 3600); else return null
  return out
}

/* ─── OpenRouter (best free AI models) ─── */
export async function fetchOpenRouter(prompt: string, model = 'meta-llama/llama-3.1-8b-instruct:free') {
  try {
    const d = await jsonFetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 800,
      }),
    })
    return d?.choices?.[0]?.message?.content || null
  } catch { return null }
}

/* ─── Gemini (AI text with web search grounding) ─── */
export async function fetchGemini(prompt: string) {
  try {
    const d = await jsonFetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }],
        }),
      }
    )
    return d?.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch { return null }
}

/* ─── AI with fallback: OpenRouter → Gemini → null ─── */
export async function fetchAI(prompt: string) {
  const out = await fetchOpenRouter(prompt)
  if (out) return out
  return fetchGemini(prompt)
}

/* ─── GDELT (news, no key) ─── */
export async function fetchGDELT(keywords: string, maxArticles = 10) {
  const d = await jsonFetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(keywords)}&mode=ArtList&format=JSON&maxrecords=${maxArticles}&timespan=7d`)
  return d?.articles || d?.output?.articles || []
}

/* ─── CoinGecko (crypto, no key) ─── */
export async function fetchCoinGecko(path: string) {
  const cached = getCache(`cg:${path}`)
  if (cached) return cached
  const d = await jsonFetch(`https://api.coingecko.com/api/v3${path}`)
  if (d) setCache(`cg:${path}`, d, 120)
  return d
}

/* ─── SEC EDGAR (no key, needs User-Agent) ─── */
function secFetch(path: string) {
  return jsonFetch(`https://data.sec.gov${path}`, { headers: { 'User-Agent': 'ArchieFinanceSuite/1.0 (archie@example.com)' } })
}

export async function fetchSECCompanyFacts(cik: string) {
  const padded = cik.padStart(10, '0')
  return secFetch(`/api/xbrl/companyfacts/CIK${padded}.json`)
}

export async function fetchSECSubmissions(cik: string) {
  const padded = cik.padStart(10, '0')
  return secFetch(`/submissions/CIK${padded}.json`)
}

/* ─── CIK lookup via SEC ticker map (dynamic, no hardcoded list) ─── */
export async function fetchCIK(ticker: string) {
  const cached = getCache(`cik:${ticker}`)
  if (cached) return cached
  const d = await secFetch(`/files/company_tickers.json`)
  if (!d) return null
  for (const [_, v] of Object.entries(d)) {
    const entry = v as any
    if (uc(entry.ticker) === uc(ticker)) {
      const cik = String(entry.cik_str)
      setCache(`cik:${ticker}`, cik, 86400)
      return cik
    }
  }
  return null
}

/* ─── OpenFIGI (symbol lookup, no key) ─── */
export async function fetchOpenFIGI(ticker: string) {
  const cached = getCache(`figi:${ticker}`)
  if (cached) return cached
  const d = await jsonFetch('https://api.openfigi.com/v3/mapping', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([{ idType: 'TICKER', idValue: uc(ticker), securityType: 'Common Stock' }]),
  })
  const r = d?.[0]?.data?.[0]
  if (r) setCache(`figi:${ticker}`, r, 86400)
  return r || null
}

/* ─── Health ping ─── */
export async function pingSource(source: string): Promise<'ok' | 'degraded' | 'down'> {
  try {
    const url = {
      finnhub: `https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=${FINNHUB_KEY}`,
      twelve: `https://api.twelvedata.com/quote?symbol=AAPL&apikey=${TWELVE_KEY}`,
      fred: `https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=${FRED_KEY}&file_type=json&limit=1`,
      gemini: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=${GEMINI_KEY}`,
      openrouter: 'https://openrouter.ai/api/v1/models',
      yahoo: 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=1d&interval=1d',
      alphavantage: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${ALPHA_KEY}`,
      stooq: 'https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcvn&h&e=csv',
      coingecko: 'https://api.coingecko.com/api/v3/ping',
      sec: 'https://data.sec.gov/submissions/CIK0000320193.json',
    }[source]
    if (!url) return 'down'
    const res = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: source === 'sec' ? { 'User-Agent': 'ArchieFinanceSuite/1.0' } : undefined,
    })
    if (!res.ok) return res.status === 429 ? 'degraded' : 'down'
    return 'ok'
  } catch { return 'down' }
}
