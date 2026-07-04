'use client'

import { Globe } from 'lucide-react'

export default function SupplyAtlasPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10">
          <Globe className="text-cyan-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Supply Atlas</h1>
      </div>
      <iframe
        src="https://supplychainatlas.lovable.app/"
        className="flex-1 w-full border-0"
        title="Supply Atlas"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
