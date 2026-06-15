import { NextRequest, NextResponse } from 'next/server'
import { fetchCoinGecko } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker')?.toLowerCase()

  if (ticker) {
    const raw = await fetchCoinGecko(`/simple/price?ids=${ticker}&vs_currencies=usd&include_24hr_change=true`)
    if (!raw || !raw[ticker]) return NextResponse.json([])
    const d = raw[ticker]
    return NextResponse.json([{
      id: ticker,
      symbol: ticker,
      name: ticker.charAt(0).toUpperCase() + ticker.slice(1),
      current_price: d.usd ?? null,
      price_change_percentage_24h: d.usd_24h_change ?? null,
      market_cap: null,
      total_volume: null,
      image: null,
    }])
  }

  const data = await fetchCoinGecko('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
  if (!Array.isArray(data)) return NextResponse.json([])

  return NextResponse.json(data.map((c: any) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    current_price: c.current_price ?? null,
    price_change_percentage_24h: c.price_change_percentage_24h ?? null,
    market_cap: c.market_cap ?? null,
    total_volume: c.total_volume ?? null,
    image: c.image ?? null,
  })))
}
