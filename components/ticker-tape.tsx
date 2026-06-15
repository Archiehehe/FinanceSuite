'use client'

import { useEffect, useState } from 'react'

interface Quote {
  ticker: string
  price: number
  change: number
  changePercent: number
}

interface TickerTapeProps {
  portfolio?: string
}

export default function TickerTape({ portfolio }: TickerTapeProps) {
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const params = portfolio ? `?portfolio=${portfolio}` : ''
        const res = await fetch(`/api/ticker-tape${params}`)
        if (res.ok) setQuotes(await res.json())
      } catch {}
    }
    fetchQuotes()
    const id = setInterval(fetchQuotes, 60000)
    return () => clearInterval(id)
  }, [portfolio])

  if (quotes.length === 0) return <div className="h-8 bg-card border-b border-border" />

  const items = [...quotes, ...quotes]

  return (
    <div className="w-full overflow-hidden bg-card border-b border-border h-8 flex items-center">
      <div className="flex gap-8 whitespace-nowrap ticker-scroll">
        {items.map((q, i) => (
          <span key={i} className="text-xs font-mono flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{q.ticker}</span>
            <span className="text-muted-foreground">${q.price?.toFixed(2)}</span>
            <span className={q.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              {q.change >= 0 ? '+' : ''}{q.changePercent?.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
