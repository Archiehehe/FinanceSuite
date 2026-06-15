'use client'

import { TrendingDown } from 'lucide-react'

export default function DipSnipePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10">
          <TrendingDown className="text-red-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">DipSnipe</h1>
      </div>
      <iframe
        src="https://archiehehe.shinyapps.io/DipSnipe/"
        className="flex-1 w-full border-0"
        title="DipSnipe"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
