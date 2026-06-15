import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | null | undefined, decimals = 2): string {
  if (num === null || num === undefined || isNaN(num)) return '—'
  if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(decimals) + 'T'
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(decimals) + 'B'
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(decimals) + 'M'
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(decimals) + 'K'
  return num.toFixed(decimals)
}

export function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '—'
  const val = Math.abs(num) < 1 && num !== 0 ? num * 100 : num
  const sign = val >= 0 ? '+' : ''
  return sign + val.toFixed(2) + '%'
}

export function formatPrice(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '—'
  return '$' + num.toFixed(2)
}

export function getRatingLabel(score: number | null | undefined): { label: string; color: string } {
  if (!score) return { label: 'Hold', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  if (score <= 1.5) return { label: 'Strong Buy', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
  if (score <= 2.2) return { label: 'Buy', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
  if (score <= 2.8) return { label: 'Hold', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  if (score <= 3.5) return { label: 'Sell', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
  return { label: 'Strong Sell', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
}
