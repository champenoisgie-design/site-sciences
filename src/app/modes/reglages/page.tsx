import { cookies } from 'next/headers'

export default async function ModesSettingsPage() {
  const jar = await cookies()
  const entModes = (jar.get('ent_modes')?.value || '')
    .split(',')
    .filter(Boolean)
  const current = jar.get('learningMode')?.value || 'normal'

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Réglages des modes</h1>
      <p className="text-sm text-gray-600 mb-6">
        Vous avez accès aux modes : {entModes.join(', ') || '—'}.
      </p>

      <div className="border rounded p-4">
        <div className="font-semibold">
          Mode actuel : {current.toUpperCase()}
        </div>
        <p className="text-sm text-gray-600">
          Les préférences spécifiques (par ex. syllabation en DYS, pomodoro en
          TDAH) seront ajoutées ici.
        </p>
      </div>
    </div>
  )
}
