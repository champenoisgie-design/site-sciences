'use client'
import Link from 'next/link'
import { tutorials } from '@/lib/tutorials'
import { useSelection } from '@/components/SelectionProvider'

export default function ClientPage() {
  const { selection } = useSelection()
  const filtered = tutorials.filter((t) => {
    if (selection.school && t.school !== selection.school) return false
    if (selection.grade && t.grade !== selection.grade) return false
    if (selection.subject && t.subject !== selection.subject) return false
    return true
  })

  const list = filtered.length ? filtered : tutorials

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Tutoriels</h1>
      {filtered.length === 0 && (
        <p className="mb-4 text-sm text-zinc-500">
          Aucun tutoriel strictement correspondant à ta sélection pour l’instant
          — affichage de suggestions.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {list.map((t) => (
          <article key={t.slug} className="rounded-2xl border p-5">
            <div className="mb-1 text-xs text-zinc-500">
              {t.subject} • {t.school === 'college' ? 'Collège' : 'Lycée'}{' '}
              {t.grade} • MAJ{' '}
              {new Date(t.updatedAt).toLocaleDateString('fr-FR')}
            </div>
            <h2 className="text-xl font-semibold">{t.title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {t.excerpt}
            </p>
            <Link
              href={`/tutoriels/${t.slug}`}
              className="mt-4 inline-block rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Lire le tutoriel
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
