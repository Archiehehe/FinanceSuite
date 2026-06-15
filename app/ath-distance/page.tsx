'use client'

import { Mountain } from 'lucide-react'

export default function AthDistancePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10">
          <Mountain className="text-emerald-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">ATH Distance</h1>
      </div>
      <iframe
        src="https://athdistance.streamlit.app/?embed=true"
        className="flex-1 w-full border-0"
        title="ATH Distance"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
