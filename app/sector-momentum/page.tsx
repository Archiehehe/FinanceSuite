'use client'

import { Activity } from 'lucide-react'

export default function SectorMomentumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10">
          <Activity className="text-orange-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Sector Momentum Tracker</h1>
      </div>
      <iframe
        src="https://archiehehe.shinyapps.io/SectorMomentumTracker/"
        className="flex-1 w-full border-0"
        title="Sector Momentum Tracker"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
