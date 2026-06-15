'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Activity, ChevronUp, ChevronDown } from 'lucide-react'

type Status = 'ok' | 'degraded' | 'down'

interface Health {
  sources: Record<string, Status>
  timestamp: number
}

const SOURCE_LABELS: Record<string, string> = {
  fmp: 'FMP', finnhub: 'Finnhub', twelve: 'Twelve Data', fred: 'FRED',
  gemini: 'Gemini', openrouter: 'OpenRouter', yahoo: 'Yahoo',
  alphavantage: 'Alpha V', stooq: 'Stooq', coingecko: 'CoinGecko', sec: 'SEC',
}

export default function ApiStatus({ collapsed }: { collapsed?: boolean }) {
  const [health, setHealth] = useState<Health | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health')
        if (res.ok) setHealth(await res.json())
      } catch {}
    }
    fetchHealth()
  }, [])

  if (!health) return null

  const vals = Object.values(health.sources)
  const up = vals.filter(v => v === 'ok').length
  const total = vals.length
  const pct = total ? Math.round((up / total) * 100) : 0

  if (collapsed) {
    return (
      <div className="px-3 py-2 border-t border-border" title={`${up}/${total} APIs up`}>
        <div className="flex items-center justify-center gap-1">
          <Activity size={14} className={pct === 100 ? 'text-emerald-400' : pct > 50 ? 'text-amber-400' : 'text-red-400'} />
          <span className="text-[10px] font-mono text-muted-foreground">{up}/{total}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity size={14} className={pct === 100 ? 'text-emerald-400' : pct > 50 ? 'text-amber-400' : 'text-red-400'} />
          <span className="font-mono">APIs ({up}/{total})</span>
        </div>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="px-3 pb-2 space-y-1">
          {Object.entries(health.sources).map(([key, status]) => (
            <div key={key} className="flex items-center justify-between text-[10px]">
              <span className="text-muted-foreground">{SOURCE_LABELS[key] || key}</span>
              <span className={cn(
                'font-mono',
                status === 'ok' && 'text-emerald-400',
                status === 'degraded' && 'text-amber-400',
                status === 'down' && 'text-red-400'
              )}>
                {status === 'ok' ? '●' : status === 'degraded' ? '◐' : '○'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
