'use client'
import Link from 'next/link'
import { PRICING, MODE_LABELS, centsToEuros } from '@/config/pricing'

export default function PricingModes() {
  const modes = PRICING.modes
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(modes).map(([key, price]) => (
        <Link
          key={key}
          href={`/tarifs/mode-d-apprentissage/${key}`}
          className="rounded-2xl border p-4 transition hover:shadow-md"
        >
          <h3 className="mb-1 text-lg font-semibold">
            {MODE_LABELS[key as keyof typeof MODE_LABELS]}
          </h3>
          <p className="text-sm opacity-70">
            À partir de {centsToEuros(price)}
          </p>
        </Link>
      ))}
    </div>
  )
}
