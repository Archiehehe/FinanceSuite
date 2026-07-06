'use client'

import { BookOpen } from 'lucide-react'

export default function ThesisPathPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10">
          <BookOpen className="text-green-400" size={16} />
        </div>
        <h1 className="text-lg font-semibold text-foreground">ThesisPath</h1>
      </div>
      <iframe
        src="https://thesispath.vercel.app/"
        className="flex-1 w-full border-0"
        title="ThesisPath"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
