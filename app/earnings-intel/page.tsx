'use client'

import { BarChart3 } from 'lucide-react'

export default function EarningsIntelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
          <BarChart3 className="text-blue-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Earnings Intel</h1>
      </div>
      <iframe
        src="https://earningsintel.vercel.app/"
        className="flex-1 w-full border-0"
        title="Earnings Intel"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
