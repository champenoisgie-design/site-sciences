export interface PriceLike {
  cents: number
  adjustedCents?: number
  finalCents?: number
  [k: string]: any
}
