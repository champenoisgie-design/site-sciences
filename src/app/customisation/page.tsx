import { cookies } from 'next/headers'
import Link from 'next/link'

const SKINS = [
  { key: 'neon', label: 'Néon (accent animé)' },
  { key: 'noirprofond', label: 'Noir profond (OLED)' },
  { key: 'solaire', label: 'Solaire (clair)' },
  { key: 'pastel', label: 'Pastel (doux)' },
]

export default async function CustomisationPage() {
  const jar = await cookies()
  const entSkins = (jar.get('ent_skins')?.value || '')
    .split(',')
    .filter(Boolean)
  const active = jar.get('skin_active')?.value || 'default'

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Customisation</h1>
      <p className="text-sm text-gray-600 mb-6">
        Choisissez l’habillage du site. Le thème sélectionné s’applique
        immédiatement.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {SKINS.map((s) => {
          const owned = entSkins.includes(s.key)
          const isActive = active === s.key
          return (
            <div
              key={s.key}
              className={
                'border rounded p-4 ' + (isActive ? 'ring-2 ring-black' : '')
              }
            >
              <div className="font-semibold">{s.label}</div>
              <div className="text-sm text-gray-600">
                Achat unique – utilisable sur tous vos appareils.
              </div>
              <div className="mt-3 flex gap-3 items-center">
                {owned ? (
                  isActive ? (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      Actif
                    </span>
                  ) : (
                    <Link
                      href={`/api/skin/set?skin=${s.key}&back=/customisation`}
                      className="border rounded px-3 py-1 text-sm"
                    >
                      Activer
                    </Link>
                  )
                ) : (
                  <Link href="/tarifs?tab=skins" className="text-sm underline">
                    Acheter ce skin
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
