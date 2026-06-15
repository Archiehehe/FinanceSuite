import { NextResponse } from 'next/server'
import { fetchFRED } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

function first(obs: any[]) {
  for (const o of obs) {
    if (o.value !== '.' && o.value != null) return { value: parseFloat(o.value), date: o.date }
  }
  return null
}

function yoy(obs: any[], cur: { value: number; date: string }) {
  const prev = String(Number(cur.date.slice(0, 4)) - 1) + cur.date.slice(4)
  const o = obs.find((x: any) => x.date === prev && x.value !== '.' && x.value != null)
  return o ? cur.value - parseFloat(o.value) : null
}

export async function GET() {
  const [cpiRaw, fedRaw, t10Raw, t2Raw, unempRaw, gdpRaw] = await Promise.all([
    fetchFRED('CPIAUCSL', 24),
    fetchFRED('FEDFUNDS', 2),
    fetchFRED('DGS10', 2),
    fetchFRED('DGS2', 2),
    fetchFRED('UNRATE', 2),
    fetchFRED('GDP', 24),
  ])

  let cpi = null
  if (cpiRaw?.observations) {
    const l = first(cpiRaw.observations)
    if (l) cpi = { ...l, change: yoy(cpiRaw.observations, l) }
  }

  let gdp = null
  if (gdpRaw?.observations) {
    const l = first(gdpRaw.observations)
    if (l) gdp = { ...l, change: yoy(gdpRaw.observations, l) }
  }

  const fedRate = fedRaw?.observations ? first(fedRaw.observations) : null
  const treasury10y = t10Raw?.observations ? first(t10Raw.observations) : null
  const treasury2y = t2Raw?.observations ? first(t2Raw.observations) : null
  const unemployment = unempRaw?.observations ? first(unempRaw.observations) : null

  const yieldSpread = treasury10y && treasury2y
    ? { value: treasury10y.value - treasury2y.value, date: treasury10y.date }
    : null

  return NextResponse.json({
    cpi,
    fedRate,
    treasury10y,
    treasury2y,
    unemployment,
    gdp,
    yieldSpread,
    timestamp: new Date().toISOString(),
  })
}
