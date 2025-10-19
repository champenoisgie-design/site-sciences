'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const TABS = [
  { key: 'abos', label: 'Abonnements' },
  { key: 'skins', label: 'Skins & Thèmes' },
  { key: 'modes', label: 'Modes d’apprentissage' },
]

export default function PricingTabs() {
  const params = useSearchParams()
  const router = useRouter()
  const active = params.get('tab') || 'abos'

  function setTab(k: string) {
    const sp = new URLSearchParams(params.toString())
    sp.set('tab', k)
    router.push(`/tarifs?${sp.toString()}`)
  }

  return (
    <div className="flex gap-2 mb-6">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={[
            'px-3 py-2 rounded border text-sm',
            active === t.key
              ? 'bg-black text-white border-black'
              : 'bg-white border-gray-300',
          ].join(' ')}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
