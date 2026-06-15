'use client'

import { FolderOpen } from 'lucide-react'

export default function PortfolioMergePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/10">
          <FolderOpen className="text-teal-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Portfolio Merger</h1>
      </div>
      <iframe
        src="https://portmerge.streamlit.app/?embed=true"
        className="flex-1 w-full border-0"
        title="Portfolio Merger"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
