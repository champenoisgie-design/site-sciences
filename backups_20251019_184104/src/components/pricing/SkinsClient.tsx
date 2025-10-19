'use client'
import Link from 'next/link'

const EUR = '€'
const P_SKIN = Number(process.env.NEXT_PUBLIC_PRICE_EUR_SKIN ?? 0)

type Props = { entSkins: string[] }

const SKINS = [
  { key: 'neon', label: 'Néon (accent animé)' },
  { key: 'noirprofond', label: 'Noir profond (OLED)' },
  { key: 'solaire', label: 'Solaire (clair, ensoleillé)' },
  { key: 'pastel', label: 'Pastel (doux & calme)' },
]

function price(n: number) {
  return n ? `${n.toFixed(2)} ${EUR}` : '—'
}

export default function SkinsClient({ entSkins }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Skins & Thèmes</h2>
      <p className="text-sm text-gray-600 mb-4">
        Personnalisez l’apparence du site. Achat <strong>unique</strong>,
        activable sur tous vos appareils.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {SKINS.map((s) => {
          const has = entSkins.includes(s.key)
          return (
            <div key={s.key} className="border rounded p-4">
              <div className="font-medium">{s.label}</div>
              <div className="text-sm text-gray-600">
                Prix: <strong>{price(P_SKIN)}</strong> (paiement unique)
              </div>
              <div className="mt-2">
                {has ? (
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    Déjà acquis
                  </span>
                ) : (
                  <Link
                    href={`/api/checkout?skin=${s.key}`}
                    className="text-sm underline"
                  >
                    Acheter ce thème
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Bonus : un badge exclusif est débloqué à chaque achat de skin.
      </p>
    </div>
  )
}
