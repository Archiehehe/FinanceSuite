'use client'

import { useState, useCallback } from 'react'
import { GraduationCap, Search, Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

interface MetricRow { label: string; value: string | number | null; format?: 'pct' | 'ratio' | 'money' }

export default function SuperInvestorLabPage() {
  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const analyze = useCallback(async () => {
    if (!ticker.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const res = await fetch(`/api/superinvestor?ticker=${ticker.trim().toUpperCase()}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      setData(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [ticker])

  const fmt = (v: number | null, f?: string) => {
    if (v === null || v === undefined || isNaN(v)) return '—'
    if (f === 'pct') return `${(v * 100).toFixed(2)}%`
    if (f === 'money') return v >= 1e12 ? `$${(v / 1e12).toFixed(2)}T` : v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${v.toFixed(2)}`
    if (f === 'ratio' || !f) return typeof v === 'number' ? v.toFixed(2) : String(v)
    return String(v)
  }

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10">
          <GraduationCap className="text-purple-400" size={22} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">SuperInvestor Lab</h1>
          <p className="text-sm text-muted-foreground">Analyze stocks through the lens of legendary investors</p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          value={ticker}
          onChange={e => setTicker(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="Enter ticker (e.g. AAPL)"
          className="flex-1 max-w-xs px-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-purple-500/50"
        />
        <button onClick={analyze} disabled={loading || !ticker.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50 transition-all text-sm font-medium">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{data.metrics.companyName}</h2>
                  <p className="text-sm text-muted-foreground font-mono">{data.metrics.ticker} · {data.metrics.sector || 'N/A'} · {data.metrics.exchange || 'N/A'}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground font-mono">${data.metrics.price?.toFixed(2)}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Market Cap</span><div className="text-foreground font-mono font-medium">{fmt(data.metrics.marketCap, 'money')}</div></div>
                <div><span className="text-muted-foreground">P/E</span><div className="text-foreground font-mono font-medium">{fmt(data.metrics.pe, 'ratio')}</div></div>
                <div><span className="text-muted-foreground">Forward P/E</span><div className="text-foreground font-mono font-medium">{fmt(data.metrics.forwardPe, 'ratio')}</div></div>
                <div><span className="text-muted-foreground">Beta</span><div className="text-foreground font-mono font-medium">{fmt(data.metrics.beta, 'ratio')}</div></div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Key Metrics</h3>
              {[
                { label: 'PEG Ratio', value: data.metrics.pegRatio, f: 'ratio' },
                { label: 'P/B', value: data.metrics.pb, f: 'ratio' },
                { label: 'P/S', value: data.metrics.ps, f: 'ratio' },
                { label: 'EV/Revenue', value: data.metrics.evToRevenue, f: 'ratio' },
                { label: 'Gross Margin', value: data.metrics.grossMargin, f: 'pct' },
                { label: 'Operating Margin', value: data.metrics.operatingMargin, f: 'pct' },
                { label: 'Net Margin', value: data.metrics.netMargin, f: 'pct' },
                { label: 'ROE', value: data.metrics.roe, f: 'pct' },
                { label: 'ROA', value: data.metrics.roa, f: 'pct' },
                { label: 'Revenue Growth', value: data.metrics.revenueGrowth, f: 'pct' },
                { label: 'Debt/Equity', value: data.metrics.debtToEquity, f: 'ratio' },
                { label: 'Current Ratio', value: data.metrics.currentRatio, f: 'ratio' },
                { label: 'Dividend Yield', value: data.metrics.dividendYield, f: 'pct' },
              ].map(m => (
                <div key={m.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="text-foreground font-mono font-medium">{fmt(m.value, m.f as any)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Investor Evaluations</h3>
            {data.results.map((r: any) => (
              <div key={r.investorId} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{r.investorName}</h4>
                    <p className="text-xs text-muted-foreground">{r.style}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                    r.signal === 'pass' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    r.signal === 'fail' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {r.signal === 'pass' ? <TrendingUp size={14} /> : r.signal === 'fail' ? <TrendingDown size={14} /> : <AlertCircle size={14} />}
                    {r.signal === 'pass' ? 'Pass' : r.signal === 'fail' ? 'Fail' : 'Warn'} · {r.score}%
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{r.passCount} pass</span>
                  <span>{r.warnCount} warn</span>
                  <span>{r.failCount} fail</span>
                </div>
                <div className="space-y-2">
                  {r.checklist.map((c: any, i: number) => (
                    <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg text-sm ${
                      c.signal === 'pass' ? 'bg-emerald-500/5' : c.signal === 'fail' ? 'bg-red-500/5' : 'bg-amber-500/5'
                    }`}>
                      <span className={`mt-0.5 shrink-0 ${
                        c.signal === 'pass' ? 'text-emerald-400' : c.signal === 'fail' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {c.signal === 'pass' ? '✓' : c.signal === 'fail' ? '✗' : '~'}
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">{c.criterion}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{c.value} — {c.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
