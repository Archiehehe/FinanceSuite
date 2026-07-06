'use client'

import Link from 'next/link'
import { TOOLS } from '@/lib/constants'
import {
  Zap, BarChart3, GraduationCap, Calendar, FileText, Brain,
  TrendingDown, Receipt, Mountain, Activity, FolderOpen,
  Telescope, Globe, GitCompare, BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ElementType> = {
  Zap, BarChart3, GraduationCap, Calendar, FileText, Brain,
  TrendingDown, Receipt, Mountain, Activity, FolderOpen, Telescope,
  Globe, GitCompare, BookOpen
}

const colorMap: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  green: 'bg-green-500/10 text-green-500 border-green-500/20',
  rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  red: 'bg-red-500/10 text-red-500 border-red-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  teal: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
  sky: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
}

const taglineColorMap: Record<string, string> = {
  amber: 'text-amber-500/70', blue: 'text-blue-500/70', purple: 'text-purple-500/70',
  green: 'text-green-500/70', rose: 'text-rose-500/70', indigo: 'text-indigo-500/70',
  red: 'text-red-500/70', cyan: 'text-cyan-500/70', emerald: 'text-emerald-500/70',
  orange: 'text-orange-500/70', teal: 'text-teal-500/70', sky: 'text-sky-500/70',
}

const gradientMap: Record<string, string> = {
  amber: 'from-transparent via-amber-500/20 to-transparent',
  blue: 'from-transparent via-blue-500/20 to-transparent',
  purple: 'from-transparent via-purple-500/20 to-transparent',
  green: 'from-transparent via-green-500/20 to-transparent',
  rose: 'from-transparent via-rose-500/20 to-transparent',
  indigo: 'from-transparent via-indigo-500/20 to-transparent',
  red: 'from-transparent via-red-500/20 to-transparent',
  cyan: 'from-transparent via-cyan-500/20 to-transparent',
  emerald: 'from-transparent via-emerald-500/20 to-transparent',
  orange: 'from-transparent via-orange-500/20 to-transparent',
  teal: 'from-transparent via-teal-500/20 to-transparent',
  sky: 'from-transparent via-sky-500/20 to-transparent',
}

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="text-amber-500" size={32} />
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-amber-500">Archie's</span>
              <span className="text-foreground">&nbsp;FinanceSuite</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono max-w-2xl mx-auto">
            A unified collection of financial analysis tools — stock research, peer comparison,
            earnings intelligence, market narratives, sector momentum, and more.
            <br />All data fetched live from multiple APIs.
          </p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map((tool, i) => {
            const Icon = iconMap[tool.icon] || Zap
            return (
              <Link
                key={tool.id}
                href={tool.route}
                className="group relative overflow-hidden rounded-lg border border-border bg-card hover:bg-accent/50 transition-all p-5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn("p-2.5 rounded-lg border", colorMap[tool.color])}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{tool.name}</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tool.status}
                      </span>
                    </div>
                    <p className={cn("text-xs font-mono mb-2", taglineColorMap[tool.color])}>{tool.tagline}</p>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <div className={cn("absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", gradientMap[tool.color])} />
              </Link>
            )
          })}
        </div>

        {/* API Status */}
        <div className="mt-12 p-4 rounded-lg border border-border bg-card">
          <h3 className="text-sm font-mono text-muted-foreground mb-3">Connected Data Sources</h3>
          <div className="flex flex-wrap gap-2">
            {['Alpha Vantage', 'Financial Modeling Prep', 'Groq AI', 'Polygon.io', 'Finnhub', 'Yahoo Finance', 'NASDAQ', 'MarketBeat', 'SEC', 'FRED', 'Twelve Data', 'SimFin', 'Sentisense', 'GuruFocus'].map(src => (
              <span key={src} className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {src}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            All tools fetch live market data. API keys configured via environment variables.
          </p>
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground pb-8">
          Archie's FinanceSuite &mdash; Built for research purposes only. Not financial advice.
        </footer>
      </div>
    </div>
  )
}
