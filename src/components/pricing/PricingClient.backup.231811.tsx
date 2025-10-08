'use client'

import Link from 'next/link'
import { useMemo } from 'react'

type PlanKey = 'normal' | 'gold' | 'platine'
type Prices = {
  plans: { normal: number; gold: number; platine: number }
  packs?: { key: string; label: string; price: number }[]
  subjects?: { key: string; label: string; price?: number }[]
  modes?: Record<string, number>
  skins?: Record<string, number>
}

function withDefaults(prices?: Partial<Prices>): Prices {
  const basePlans = { normal: 0, gold: 0, platine: 0 }
  return {
    plans: { ...basePlans, ...(prices?.plans ?? {}) },
    packs: prices?.packs ?? [
      { key: 'pack3', label: 'Pack 3 matières', price: 0 },
      { key: 'family', label: 'Pack Famille', price: 0 },
    ],
    subjects: prices?.subjects ?? [],
    modes: prices?.modes ?? {},
    skins: prices?.skins ?? {},
  }
}

function readCSV(cookieName: string): string[] {
  if (typeof document === 'undefined') return []
  const esc = cookieName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const m = document.cookie.match(new RegExp('(?:^|; )' + esc + '=([^;]+)'))
  return m ? decodeURIComponent(m[1]).split(',').filter(Boolean) : []
}

export default function PricingClient(props: any) {
  // Prix avec fallbacks
  const pr = useMemo(() => withDefaults(props?.prices), [props?.prices])

  // Entitlements depuis cookies (toujours définis)
  const entPacks = readCSV('ent_packs')
  const entSubjects = readCSV('ent_subjects')
  const entModes = readCSV('ent_modes')
  const entSkins = readCSV('ent_skins')
  const entPlans = readCSV('ent_plans')

  // Plan sélectionné
  const selectedPlan: PlanKey = (
    (props?.plan ?? 'normal') as string
  ).toLowerCase() as PlanKey
  const planPrice =
    selectedPlan === 'gold'
      ? pr.plans.gold
      : selectedPlan === 'platine'
        ? pr.plans.platine
        : pr.plans.normal

  return (
    <div className="space-y-10">
      {/* SECTION PLANS MATIÈRE */}
      <section className="border rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Abonnement matière</h2>
        <p className="text-sm text-zinc-600 mt-1">
          Plan sélectionné : <strong>{selectedPlan}</strong>
          {entPlans.includes(selectedPlan) && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
              Déjà inclus
            </span>
          )}
        </p>
        <p className="mt-2 text-2xl font-bold">
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

      {/* SECTION PACKS */}
      <section className="border rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Packs</h2>
        <div className="mt-3 grid sm:grid-cols-2 gap-4">
          {pr.packs!.map((p) => (
            <div key={p.key} className="border rounded-xl p-4">
              <div className="font-medium">{p.label}</div>
              <div className="text-sm text-zinc-600 mt-1">
                {(p.price / 100).toFixed(2)} € / mois
              </div>
              <div className="mt-2">
                {entPacks.includes(p.key) ? (
                  <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                    Déjà inclus
                  </span>
                ) : (
                  <Link
                    href={`/api/checkout?type=pack&key=${p.key}`}
                    className="underline text-sm"
                  >
                    S’abonner
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION MATIÈRES (si fournies) */}
      {Array.isArray(pr.subjects) && pr.subjects.length > 0 && (
        <section className="border rounded-2xl p-5">
          <h2 className="text-lg font-semibold">Matières</h2>
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pr.subjects!.map((s) => {
              const price = typeof s.price === 'number' ? s.price : planPrice
              return (
                <div key={s.key} className="border rounded-xl p-4">
                  <div className="font-medium">{s.label}</div>
                  <div className="text-sm text-zinc-600 mt-1">
                    {(price / 100).toFixed(2)} € / mois
                  </div>
                  <div className="mt-2">
                    {entSubjects.includes(s.key) ? (
                      <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
                        Déjà inclus
                      </span>
                    ) : (
                      <Link
                        href={`/api/checkout?type=subject&plan=${selectedPlan}`}
                        className="underline text-sm"
                      >
                        S’abonner
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* SECTION MODES / SKINS (état d’achat indicatif) */}
      <section className="border rounded-2xl p-5">
        <h2 className="text-lg font-semibold">Personnalisation</h2>
        <div className="text-sm text-zinc-600">
          Modes possédés: {entModes.join(', ') || '—'}
        </div>
        <div className="text-sm text-zinc-600">
          Skins possédés: {entSkins.join(', ') || '—'}
        </div>
        <div className="mt-3 flex gap-3">
          <Link href="/customisation" className="underline text-sm">
            Voir mes thèmes & modes
          </Link>
          <Link
            href="/tarifs/mode-d-apprentissage"
            className="underline text-sm"
          >
            Acheter un mode
          </Link>
          <Link href="/tarifs?tab=skins" className="underline text-sm">
            Acheter un thème
          </Link>
        </div>
      </section>
    </div>
  )
}
