import { NextResponse } from 'next/server'
import { fetchFinnhub, fetchGDELT } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  let articles: any[] = []

  const finn = await fetchFinnhub('/news?category=general')
  if (Array.isArray(finn) && finn.length) {
    articles = finn.map((a: any) => ({
      headline: a.headline ?? null,
      source: a.source ?? null,
      url: a.url ?? null,
      datetime: a.datetime ?? null,
      summary: a.summary ?? null,
      image: a.image ?? null,
      related: a.related ?? null,
    }))
  } else {
    const gdelt = await fetchGDELT('stock market', 10)
    if (Array.isArray(gdelt) && gdelt.length) {
      articles = gdelt.map((a: any) => ({
        headline: a.title ?? a.seentitle ?? null,
        source: a.source ?? a.domain ?? null,
        url: a.url ?? a.link ?? null,
        datetime: a.seendate ? new Date(a.seendate).getTime() : null,
        summary: a.summary ?? null,
        image: a.image ?? null,
        related: null,
      }))
    }
  }

  return NextResponse.json(articles)
}
