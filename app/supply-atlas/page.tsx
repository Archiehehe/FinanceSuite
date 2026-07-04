'use client'

import { useState } from 'react'
import { Globe, Library, GitBranch, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'home', label: 'Home', icon: Globe, href: 'https://supply-atlas1.lovable.app/' },
  { id: 'themes', label: 'Coverage Library', icon: Library, href: 'https://supply-atlas1.lovable.app/themes' },
  { id: 'runs', label: 'Research Runs', icon: GitBranch, href: 'https://supply-atlas1.lovable.app/runs' },
  { id: 'maps', label: 'Published Maps', icon: Map, href: 'https://supply-atlas1.lovable.app/maps' },
]

export default function SupplyAtlasPage() {
  const [activeTab, setActiveTab] = useState(TABS[0])

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-1 px-4 py-2">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  activeTab.id === tab.id
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex-1">
        <iframe
          src={activeTab.href}
          className="w-full h-full border-0"
          title="Supply Atlas"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  )
}
