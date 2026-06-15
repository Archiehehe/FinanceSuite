import { NextResponse } from 'next/server'
import { pingSource } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const sources = ['finnhub', 'twelve', 'fred', 'gemini', 'openrouter', 'yahoo', 'alphavantage', 'stooq', 'coingecko', 'sec'] as const

  const results = await Promise.all(
    sources.map(async (s) => ({ [s]: await pingSource(s) }))
  )

  const statuses = Object.assign({}, ...results)

  return NextResponse.json({
    sources: statuses,
    timestamp: new Date().toISOString(),
  })
}
