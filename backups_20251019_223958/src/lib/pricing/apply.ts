export type PriceLike = {
  cents: number
  adjustedCents?: number
  finalCents?: number
  [k: string]: any
}

export function applySubjectsCount(baseCents: number, subjectsCount: number): number {
  const n = Math.max(1, Number.isFinite(subjectsCount) ? Math.floor(subjectsCount) : 1)
  const r = Math.round(baseCents * n)
  return r >= 0 ? r : 0
}

export function normalizePriceForCart<T extends PriceLike>(
  price: T,
  subjectsCount: number
): T & { adjustedCents: number; finalCents: number } {
  const base = typeof price.cents === 'number' ? price.cents : 0
  const adjusted = applySubjectsCount(base, subjectsCount)
  const finalCents = typeof price.finalCents === 'number' && price.finalCents >= 0
    ? price.finalCents
    : adjusted
  return { ...price, adjustedCents: adjusted, finalCents }
}
