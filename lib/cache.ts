interface CacheEntry {
  data: any
  ts: number
}

const store = new Map<string, CacheEntry>()
const defaults = { quote: 300, financial: 3600, filing: 86400, macro: 21600, news: 600 }

export function getCache(key: string) {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > defaults.quote * 1000) {
    store.delete(key)
    return null
  }
  return entry.data
}

export function setCache(key: string, data: any, ttl?: number) {
  store.set(key, { data, ts: Date.now() })
}

export function clearCache(pattern?: string) {
  if (!pattern) { store.clear(); return }
  Array.from(store.keys()).forEach(key => {
    if (key.includes(pattern)) store.delete(key)
  })
}

export function getCacheStats() {
  return { size: store.size }
}
