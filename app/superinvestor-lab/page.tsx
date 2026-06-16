'use client'

import { GraduationCap } from 'lucide-react'

export default function SuperInvestorLabPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10">
          <GraduationCap className="text-purple-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">SuperInvestor Lab</h1>
      </div>
      <iframe
        src="https://superinvestorlab.vercel.app/"
        className="flex-1 w-full border-0"
        title="SuperInvestor Lab"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
