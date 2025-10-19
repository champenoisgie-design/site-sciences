'use client'

import Link from 'next/link'
import { useMemo } from 'react'

type Prices = {
  plans: { normal: number; gold: number; platine: number }
  modes?: Record<string, number>
  skins?: Record<string, number>
  packs?: { key: string; label: string; price: number }[]
}

function withDefaults(prices?: Partial<Prices>): Prices {
  const base = { normal: 0, gold: 0, platine: 0 }
  return {
    plans: { ...base, ...(prices?.plans ?? {}) },
    modes: prices?.modes ?? {},
    skins: prices?.skins ?? {},
    packs: prices?.packs ?? [
      { key: 'pack3', label: 'Pack 3 matières', price: 0 },
      { key: 'family', label: 'Pack Famille', price: 0 },
    ],
  }
}

export default function PricingClientSafe(props: any) {
  const pr = useMemo(() => withDefaults(props?.prices), [props?.prices])

  // éviter toute dépendance fragile : pas de cookies, pas d’entitlements ici
  const selectedPlan = (props?.plan ?? 'normal').toLowerCase()
  const planPrice =
    selectedPlan === 'gold'
      ? pr.plans.gold
      : selectedPlan === 'platine'
        ? pr.plans.platine
        : pr.plans.normal

  return (
    <div className="space-y-6">
      <section className="border rounded-2xl p-4">
        <h2 className="text-lg font-semibold">Abonnement matière</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Plan sélectionné : <strong>{selectedPlan}</strong>
        </p>
        <p className="mt-2 text-xl font-bold">
          {(planPrice / 100).toFixed(2)} € / mois
        </p>
        <div className="mt-3 flex gap-3">
          <Link
            href={`/api/checkout?type=subject&plan=${selectedPlan}`}
            className="underline text-sm"
          >
            S’abonner
          </Link>
          <Link href="/tarifs?tab=compare" className="underline text-sm">
            Comparer les plans
          </Link>
        </div>
      </section>

      <section className="border rounded-2xl p-4">
        <h2 className="text-lg font-semibold">Packs</h2>
        <div className="mt-3 grid sm:grid-cols-2 gap-4">
          {pr.packs!.map((p) => (
            <div key={p.key} className="border rounded-xl p-3">
              <div className="font-medium">{p.label}</div>
              <div className="text-sm text-zinc-600 mt-1">
                {(p.price / 100).toFixed(2)} € / mois
              </div>
              <div className="mt-2">
                {/* on ne tente pas d’afficher "Déjà inclus" ici, car pas d’entitlements dans le safe */}
                <Link
                  href={`/api/checkout?type=pack&key=${p.key}`}
                  className="underline text-sm"
                >
                  S’abonner
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
