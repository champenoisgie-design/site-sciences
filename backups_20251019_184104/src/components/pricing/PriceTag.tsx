'use client'
export default function PriceTag({
  amount,
  small = false,
}: {
  amount: number | string
  small?: boolean
}) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  const isNum = Number.isFinite(num)
  const text = isNum
    ? new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(num)
    : '—'
  return (
    <span className={small ? 'text-sm font-semibold' : 'text-xl font-semibold'}>
      {text}
      <span className="text-xs">/mois</span>
    </span>
  )
}
