'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TOOLS } from '@/lib/constants'
import {
  Zap, BarChart3, GraduationCap, Calendar, FileText, Brain,
  TrendingDown, Receipt, Mountain, Activity, FolderOpen,
  ChevronLeft, ChevronRight, LayoutDashboard, Telescope, Globe, GitCompare, BookOpen
} from 'lucide-react'
import { useState } from 'react'
import ApiStatus from './api-status'

const iconMap: Record<string, React.ElementType> = {
  Zap, BarChart3, GraduationCap, Calendar, FileText, Brain,
  TrendingDown, Receipt, Mountain, Activity, FolderOpen, Telescope,
  Globe, GitCompare, BookOpen
}

const colorMap: Record<string, string> = {
  amber: 'text-amber-500', blue: 'text-blue-500', purple: 'text-purple-500',
  green: 'text-green-500', rose: 'text-rose-500', indigo: 'text-indigo-500',
  red: 'text-red-500', cyan: 'text-cyan-500', emerald: 'text-emerald-500',
  orange: 'text-orange-500', teal: 'text-teal-500', sky: 'text-sky-500',
}

const activeBgMap: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-500',
  blue: 'bg-blue-500/10 text-blue-500',
  purple: 'bg-purple-500/10 text-purple-500',
  green: 'bg-green-500/10 text-green-500',
  rose: 'bg-rose-500/10 text-rose-500',
  indigo: 'bg-indigo-500/10 text-indigo-500',
  red: 'bg-red-500/10 text-red-500',
  cyan: 'bg-cyan-500/10 text-cyan-500',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  orange: 'bg-orange-500/10 text-orange-500',
  teal: 'bg-teal-500/10 text-teal-500',
  sky: 'bg-sky-500/10 text-sky-500',
}

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      "h-screen sticky top-0 border-r border-border bg-background/95 backdrop-blur flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <img src="https://avatars.githubusercontent.com/u/193579350?v=4" alt="Archie" className="w-5 h-5 rounded-full" />
              <span className="font-bold text-sm tracking-tight">
              <span className="text-green-500">Archie's</span>
              <span className="text-foreground">&nbsp;FinanceSuite</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <img src="https://avatars.githubusercontent.com/u/193579350?v=4" alt="Archie" className="w-5 h-5 rounded-full" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-accent text-muted-foreground"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === '/'
              ? 'bg-green-500/10 text-green-500'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          <LayoutDashboard size={18} />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        <div className="pt-2 pb-1">
          {!collapsed && (
            <p className="px-3 text-xs text-muted-foreground uppercase tracking-wider font-mono">Tools</p>
          )}
        </div>

        {TOOLS.map(tool => {
          const Icon = iconMap[tool.icon] || Zap
          return (
            <Link
              key={tool.id}
              href={tool.route}
              title={collapsed ? tool.name : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group",
                pathname === tool.route
                  ? activeBgMap[tool.color] || 'bg-amber-500/10 text-amber-500'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon size={18} className={colorMap[tool.color]} />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="truncate">{tool.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate opacity-60">{tool.tagline}</div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      <ApiStatus collapsed={collapsed} />
    </div>
  )
}
