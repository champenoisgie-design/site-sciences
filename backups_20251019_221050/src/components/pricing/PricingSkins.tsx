'use client'
import Link from 'next/link'

type Props = { entSkins: string[] }

const SKINS = [
  { key: 'neon', name: 'Néon', blurb: 'Look futuriste lumineux' },
  {
    key: 'noirprofond',
    name: 'Noir profond',
    blurb: 'Sobriété totale, contraste élevé',
  },
  { key: 'solaire', name: 'Solaire', blurb: 'Chaud et dynamique' },
  { key: 'pastel', name: 'Pastel', blurb: 'Doux et confortable' },
]

export default function PricingSkins({ entSkins }: Props) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Skins & Thèmes</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SKINS.map((s) => {
          const has = entSkins.includes(s.key)
          return (
            <div key={s.key} className="rounded-2xl border p-4">
              <div className="font-semibold">{s.name}</div>
              <p className="text-sm text-zinc-600">{s.blurb}</p>
              <div className="mt-2">
                {has ? (
                  <span className="text-xs rounded bg-green-100 text-green-700 px-2 py-1">
                    Déjà acheté
                  </span>
                ) : (
                  <Link
                    href={`/api/checkout?type=skin&key=${s.key}`}
                    className="text-sm underline"
                  >
                    Acheter ce skin
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
