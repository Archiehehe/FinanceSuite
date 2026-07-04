'use client'

import { GitCompare } from 'lucide-react'

export default function PeerComparisonPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10">
          <GitCompare className="text-indigo-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Peer Comparison</h1>
      </div>
      <iframe
        src="https://peercomparison.vercel.app/"
        className="flex-1 w-full border-0"
        title="Peer Comparison"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
