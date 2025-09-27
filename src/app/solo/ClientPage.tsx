"use client"
import { useSelection } from '@/components/SelectionProvider'

export default function ClientPage() {
  const { selection } = useSelection()
  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold">Entraînement Solo</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Exercices proposés en fonction de ta sélection :{' '}
        {selection.subject ?? '—'} •{' '}
        {selection.school
          ? selection.school === 'college'
            ? 'Collège'
            : 'Lycée'
          : '—'}{' '}
        {selection.grade ?? '—'}.
      </p>
      <div className="rounded-2xl border p-5 text-sm text-zinc-500">
        (Ici viendront les séries d’exercices filtrées. Démo : contenu en
        cours.)
      </div>
    </section>
  )
}
