'use client'

import { FileText } from 'lucide-react'

export default function MarketNarrativePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/10">
          <FileText className="text-rose-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Market Narrative Engine</h1>
      </div>
      <iframe
        src="https://marketnarrative.lovable.app/"
        className="flex-1 w-full border-0"
        title="Market Narrative Engine"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
