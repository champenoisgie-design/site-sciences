'use client'
import { PRICING, PACK_LABELS, centsToEuros } from '@/config/pricing'

type Props = { ownedSubjectsCount: number }

export default function UpsellPack3({ ownedSubjectsCount }: Props) {
  const packPrice = PRICING.packs.pack3
  const singlePrice = PRICING.plans.normal // règle : baseline = 3 * plan Normal
  const baseline = singlePrice * 3
  const savings = Math.max(0, baseline - packPrice)

  if (ownedSubjectsCount <= 0) return null

  return (
    <aside className="rounded-2xl border p-4 md:p-5 bg-yellow-50/60">
      <h4 className="mb-1 text-base font-semibold">
        Passez au {PACK_LABELS.pack3}
      </h4>
      <p className="mb-2 text-sm">
        Vous avez déjà {ownedSubjectsCount} matière
        {ownedSubjectsCount > 1 ? 's' : ''}.<br />
        Le pack 3 matières est à <strong>{centsToEuros(packPrice)}</strong> au
        lieu de <s>{centsToEuros(baseline)}</s> — vous économisez{' '}
        <strong>{centsToEuros(savings)}</strong>.
      </p>
      <button className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-black/5">
        Choisir le {PACK_LABELS.pack3}
      </button>
    </aside>
  )
}
