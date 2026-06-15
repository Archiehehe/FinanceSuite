import { NextRequest, NextResponse } from 'next/server'
import { fetchYahooQuote, fetchYahooSummary } from '@/lib/api-utils'

const INVESTOR_PROFILES = [
  { id: 'graham', name: 'Benjamin Graham', style: 'Deep Value' },
  { id: 'buffett', name: 'Warren Buffett', style: 'Quality at Fair Price' },
  { id: 'lynch', name: 'Peter Lynch', style: 'GARP' },
  { id: 'greenblatt', name: 'Joel Greenblatt', style: 'Magic Formula' },
  { id: 'fisher', name: 'Philip Fisher', style: 'Growth at Reasonable Price' },
  { id: 'munger', name: 'Charlie Munger', style: 'Mental Models & Moats' },
  { id: 'klarman', name: 'Seth Klarman', style: 'Margin of Safety' },
  { id: 'marks', name: 'Howard Marks', style: 'Risk & Cycles' },
  { id: 'ackman', name: 'Bill Ackman', style: 'Concentrated Value' },
  { id: 'templeton', name: 'John Templeton', style: 'Contrarian' },
  { id: 'burry', name: 'Michael Burry', style: 'Deep Value Scarcity' },
  { id: 'pabrai', name: 'Mohnish Pabrai', style: 'Clone Investing' },
  { id: 'smith', name: 'Terry Smith', style: 'Quality Compounders' },
  { id: 'dorsey', name: 'Pat Dorsey', style: 'Economic Moats' },
  { id: 'carlisle', name: 'Tobias Carlisle', style: "Acquirer's Multiple" },
  { id: 'thaler', name: 'Richard Thaler', style: 'Behavioral' },
]

function signal(value: number | null, pass: (n: number) => boolean, warn: (n: number) => boolean) {
  if (value === null || value === undefined || isNaN(value)) return 'warn' as const
  if (pass(value)) return 'pass' as const
  if (warn(value)) return 'warn' as const
  return 'fail' as const
}

function fmt(val: number | null, type: 'ratio' | 'pct' | 'money' = 'ratio') {
  if (val === null || val === undefined || isNaN(val)) return 'N/A'
  if (type === 'pct') return `${(val * 100).toFixed(2)}%`
  if (type === 'money') return `$${val.toFixed(2)}`
  return val.toFixed(2)
}

function evaluate(investor: typeof INVESTOR_PROFILES[number], m: Record<string, any>) {
  const check = (c: { criterion: string; signal: 'pass' | 'warn' | 'fail'; value: string; explanation: string }) => c
  const checklist: ReturnType<typeof check>[] = []
  let score = 0

  if (investor.id === 'graham') {
    checklist.push(check({ criterion: 'Valuation discipline', signal: signal(m.pe, n => n > 0 && n <= 15, n => n > 0 && n <= 25), value: `P/E ${fmt(m.pe)}`, explanation: 'Graham preferred P/E under 15 for a margin of safety.' }))
    checklist.push(check({ criterion: 'Price to Book', signal: signal(m.pb, n => n > 0 && n <= 1.5, n => n > 0 && n <= 3), value: `P/B ${fmt(m.pb)}`, explanation: 'Low P/B suggests assets are not overvalued.' }))
    checklist.push(check({ criterion: 'Financial strength', signal: signal(m.debtToEquity, n => n <= 1, n => n <= 2), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Low debt reduces risk in a downturn.' }))
    checklist.push(check({ criterion: 'Earnings stability', signal: signal(m.operatingMargin, n => n > 0.1, n => n > 0), value: `Op. margin ${fmt(m.operatingMargin, 'pct')}`, explanation: 'Positive and stable margins indicate earnings power.' }))
  } else if (investor.id === 'buffett') {
    checklist.push(check({ criterion: 'Return on equity', signal: signal(m.roe, n => n >= 0.15, n => n >= 0.1), value: `ROE ${fmt(m.roe, 'pct')}`, explanation: 'Buffett looks for durable competitive advantages via high ROE.' }))
    checklist.push(check({ criterion: 'Debt management', signal: signal(m.debtToEquity, n => n <= 0.5, n => n <= 1.5), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Low debt allows compounding without financial risk.' }))
    checklist.push(check({ criterion: 'Valuation sanity', signal: signal(m.pe, n => n > 5 && n <= 25, n => n > 0 && n <= 35), value: `P/E ${fmt(m.pe)}`, explanation: 'Reasonable P/E leaves room for upside.' }))
    checklist.push(check({ criterion: 'Pricing power', signal: signal(m.grossMargin, n => n >= 0.3, n => n >= 0.15), value: `Gross margin ${fmt(m.grossMargin, 'pct')}`, explanation: 'Wide moats protect high margins.' }))
  } else if (investor.id === 'lynch') {
    checklist.push(check({ criterion: 'PEG check', signal: signal(m.pegRatio, n => n < 1.5, n => n < 2.5), value: `PEG ${fmt(m.pegRatio)}`, explanation: 'Lynch popularized PEG under 1.5 for GARP.' }))
    checklist.push(check({ criterion: 'Growth trajectory', signal: signal(m.revenueGrowth, n => n >= 0.1, n => n >= 0), value: `Rev. growth ${fmt(m.revenueGrowth, 'pct')}`, explanation: 'Real revenue growth supports the growth narrative.' }))
    checklist.push(check({ criterion: 'Balance sheet', signal: signal(m.debtToEquity, n => n <= 1, n => n <= 2), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Lynch avoided companies drowning in debt.' }))
  } else if (investor.id === 'greenblatt') {
    checklist.push(check({ criterion: 'Earnings yield', signal: signal(m.earningsYield, n => n >= 0.08, n => n >= 0.04), value: `Earnings yield ${fmt(m.earningsYield, 'pct')}`, explanation: 'High earnings yield is half of the Magic Formula.' }))
    checklist.push(check({ criterion: 'Return on capital', signal: signal(m.roic ?? m.roe, n => n >= 0.2, n => n >= 0.1), value: `ROIC ${fmt(m.roic ?? m.roe, 'pct')}`, explanation: 'High ROC is the other half of the Magic Formula.' }))
    checklist.push(check({ criterion: 'Valuation', signal: signal(m.evToEbitda, n => n < 10, n => n < 20), value: `EV/EBITDA ${fmt(m.evToEbitda)}`, explanation: 'Low EV/EBITDA combined with high ROC is Greenblatt\'s sweet spot.' }))
  } else if (investor.id === 'fisher') {
    checklist.push(check({ criterion: 'Growth runway', signal: signal(m.revenueGrowth, n => n >= 0.15, n => n >= 0.05), value: `Rev. growth ${fmt(m.revenueGrowth, 'pct')}`, explanation: 'Fisher sought companies with sustained growth above 15%.' }))
    checklist.push(check({ criterion: 'Profitability', signal: signal(m.netMargin, n => n >= 0.1, n => n >= 0.05), value: `Net margin ${fmt(m.netMargin, 'pct')}`, explanation: 'High margins indicate pricing power and efficient operations.' }))
    checklist.push(check({ criterion: 'Debt profile', signal: signal(m.debtToEquity, n => n <= 0.5, n => n <= 1.5), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Low debt allows R&D investment without financial strain.' }))
  } else if (investor.id === 'munger') {
    checklist.push(check({ criterion: 'Moat strength', signal: signal(m.grossMargin, n => n >= 0.4, n => n >= 0.2), value: `Gross margin ${fmt(m.grossMargin, 'pct')}`, explanation: 'High gross margins suggest an enduring competitive advantage.' }))
    checklist.push(check({ criterion: 'Capital efficiency', signal: signal(m.roe, n => n >= 0.15, n => n >= 0.1), value: `ROE ${fmt(m.roe, 'pct')}`, explanation: 'Munger favors businesses that generate high returns without heavy reinvestment.' }))
    checklist.push(check({ criterion: 'Financial prudence', signal: signal(m.debtToEquity, n => n <= 0.5, n => n <= 1.5), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Low debt means the business can withstand adversity.' }))
  } else if (investor.id === 'klarman') {
    checklist.push(check({ criterion: 'Tangible value', signal: signal(m.pb, n => n > 0 && n <= 1.2, n => n > 0 && n <= 2), value: `P/B ${fmt(m.pb)}`, explanation: 'Klarman seeks stocks selling near or below book value.' }))
    checklist.push(check({ criterion: 'Capital structure', signal: signal(m.debtToEquity, n => n <= 0.5, n => n <= 1), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'A strong balance sheet provides a margin of safety.' }))
  } else if (investor.id === 'marks') {
    checklist.push(check({ criterion: 'Risk awareness', signal: signal(m.pe, n => n > 0 && n <= 15, n => n > 0 && n <= 25), value: `P/E ${fmt(m.pe)}`, explanation: 'Marks looks for reasonable valuations indicating limited downside.' }))
    checklist.push(check({ criterion: 'Leverage check', signal: signal(m.debtToEquity, n => n <= 0.5, n => n <= 1.5), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Low leverage means the company can survive credit cycles.' }))
  } else if (investor.id === 'ackman') {
    checklist.push(check({ criterion: 'Business quality', signal: signal(m.roe, n => n >= 0.15, n => n >= 0.1), value: `ROE ${fmt(m.roe, 'pct')}`, explanation: 'Ackman targets simple, high-quality businesses with strong returns.' }))
    checklist.push(check({ criterion: 'Margin strength', signal: signal(m.grossMargin, n => n >= 0.3, n => n >= 0.15), value: `Gross margin ${fmt(m.grossMargin, 'pct')}`, explanation: 'High margins suggest brand power or a defensible niche.' }))
    checklist.push(check({ criterion: 'Debt tolerance', signal: signal(m.debtToEquity, n => n <= 1, n => n <= 2), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Moderate leverage is acceptable for activist situations.' }))
  } else if (investor.id === 'templeton') {
    checklist.push(check({ criterion: 'Contrarian value', signal: signal(m.pe, n => n > 0 && n <= 10, n => n > 0 && n <= 20), value: `P/E ${fmt(m.pe)}`, explanation: 'Templeton bought when pessimism was at its peak.' }))
  } else if (investor.id === 'burry') {
    checklist.push(check({ criterion: 'Deep discount', signal: signal(m.pb, n => n > 0 && n <= 1, n => n > 0 && n <= 2), value: `P/B ${fmt(m.pb)}`, explanation: 'Burry looks for stocks trading below liquidation value.' }))
    checklist.push(check({ criterion: 'Financial resilience', signal: signal(m.debtToEquity, n => n <= 0.3, n => n <= 1), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Minimal debt is essential in distressed scenarios.' }))
  } else if (investor.id === 'pabrai') {
    checklist.push(check({ criterion: 'Deep value', signal: signal(m.pe, n => n > 0 && n <= 10, n => n > 0 && n <= 20), value: `P/E ${fmt(m.pe)}`, explanation: 'Pabrai clones the best ideas of top investors, often at very low P/E.' }))
    checklist.push(check({ criterion: 'Quality check', signal: signal(m.roe, n => n >= 0.15, n => n >= 0.1), value: `ROE ${fmt(m.roe, 'pct')}`, explanation: 'Even deep value requires a quality business underneath.' }))
  } else if (investor.id === 'smith') {
    checklist.push(check({ criterion: 'Return on equity', signal: signal(m.roe, n => n >= 0.15, n => n >= 0.1), value: `ROE ${fmt(m.roe, 'pct')}`, explanation: 'Smith seeks compounders with consistently high ROE.' }))
    checklist.push(check({ criterion: 'Debt discipline', signal: signal(m.debtToEquity, n => n <= 0.3, n => n <= 1), value: `D/E ${fmt(m.debtToEquity)}`, explanation: 'Minimal debt means earnings are not siphoned to creditors.' }))
  } else if (investor.id === 'dorsey') {
    checklist.push(check({ criterion: 'Moat measurement', signal: signal(m.grossMargin, n => n >= 0.5, n => n >= 0.3), value: `Gross margin ${fmt(m.grossMargin, 'pct')}`, explanation: 'Dorsey looks for structural competitive advantages via high margins.' }))
    checklist.push(check({ criterion: 'Return on capital', signal: signal(m.roe, n => n >= 0.15, n => n >= 0.1), value: `ROE ${fmt(m.roe, 'pct')}`, explanation: 'Returns above the cost of capital indicate a true moat.' }))
  } else if (investor.id === 'carlisle') {
    checklist.push(check({ criterion: "Acquirer's multiple", signal: signal(m.evToEbitda, n => n < 8, n => n < 15), value: `EV/EBITDA ${fmt(m.evToEbitda)}`, explanation: 'Carlisle uses low EV/EBIT (approximated by EV/EBITDA) as the key metric.' }))
  } else if (investor.id === 'thaler') {
    checklist.push(check({ criterion: 'Sentiment check', signal: signal(m.pe, n => n > 0 && n <= 15, n => n > 0 && n <= 25), value: `P/E ${fmt(m.pe)}`, explanation: 'Low P/E may indicate behavioral overreaction creating opportunity.' }))
    checklist.push(check({ criterion: 'Momentum potential', signal: signal(m.revenueGrowth, n => n >= 0.05, n => n >= 0), value: `Rev. growth ${fmt(m.revenueGrowth, 'pct')}`, explanation: 'Positive growth can attract attention and correct mispricing.' }))
  }

  const pass = checklist.filter(c => c.signal === 'pass').length
  const warn = checklist.filter(c => c.signal === 'warn').length
  const fail = checklist.filter(c => c.signal === 'fail').length
  score = Math.round(((pass * 1 + warn * 0.5) / Math.max(checklist.length, 1)) * 100)

  return {
    investorId: investor.id,
    investorName: investor.name,
    style: investor.style,
    signal: score >= 70 ? 'pass' : score >= 40 ? 'warn' : 'fail' as const,
    score,
    passCount: pass,
    warnCount: warn,
    failCount: fail,
    checklist,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker')?.toUpperCase()
  if (!ticker) {
    return NextResponse.json({ error: 'Ticker required' }, { status: 400 })
  }

  try {
    const [quote, summary] = await Promise.all([
      fetchYahooQuote(ticker).catch(() => null),
      fetchYahooSummary(ticker).catch(() => null),
    ])

    if (!quote?.price && !summary) {
      return NextResponse.json({ error: 'No data found for ticker' }, { status: 404 })
    }

    const price = quote?.price ?? 0
    const eps = summary?.eps ?? null
    const marketCap = summary?.marketCap ?? (quote?.marketCap ?? null)
    const pe = eps && eps > 0 && price > 0 ? Number((price / eps).toFixed(2)) : null

    const m = {
      ticker,
      companyName: quote?.name ?? ticker,
      price,
      marketCap,
      sector: summary?.sector ?? null,
      industry: summary?.industry ?? null,
      exchange: quote?.exchange ?? null,
      pe,
      forwardPe: summary?.forwardPe ?? null,
      pegRatio: summary?.pegRatio ?? null,
      pb: summary?.priceToBook ?? null,
      ps: summary?.revenue && marketCap ? Number((marketCap / summary.revenue).toFixed(4)) : null,
      evToEbitda: null,
      evToRevenue: summary?.revenue && summary?.enterpriseValue ? Number((summary.enterpriseValue / summary.revenue).toFixed(4)) : null,
      earningsYield: pe && pe > 0 ? Number((1 / pe).toFixed(4)) : null,
      grossMargin: summary?.grossMargin ?? null,
      operatingMargin: summary?.operatingMargin ?? null,
      netMargin: summary?.netMargin ?? null,
      roe: summary?.roe ?? null,
      roa: summary?.roa ?? null,
      roic: null,
      revenueGrowth: summary?.revenueGrowth ?? null,
      debtToEquity: summary?.debtToEquity ?? null,
      currentRatio: summary?.currentRatio ?? null,
      quickRatio: summary?.quickRatio ?? null,
      dividendYield: summary?.dividendYield ?? null,
      beta: summary?.beta ?? null,
    }

    const results = INVESTOR_PROFILES.map(inv => evaluate(inv, m))

    return NextResponse.json({ metrics: m, results })
  } catch (e) {
    console.error('Superinvestor error:', e)
    return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500 })
  }
}
