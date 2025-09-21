"use client"
import { useSelection } from "@/components/SelectionProvider"
import { exercises } from "@/lib/exercises"

export default function Page() {
  const { selection } = useSelection()

  const filtered = exercises.filter(e => {
    if (selection.school && e.school !== selection.school) return false
    if (selection.grade && e.grade !== selection.grade) return false
    if (selection.subject && e.subject !== selection.subject) return false
    return true
  })

  return (
    <section>
      <h1 className="mb-2 text-3xl font-bold">Entraînement Solo</h1>
      <p className="mb-6 text-zinc-600 dark:text-zinc-400">
        Exercices selon ta sélection : {selection.subject ?? "—"} •{" "}
        {selection.school ? (selection.school === "college" ? "Collège" : "Lycée") : "—"}{" "}
        {selection.grade ?? "—"}.
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border p-5 text-sm text-zinc-500">
          Aucun exercice pour l’instant sur cette combinaison.
        </div>
      ) : (
        <ul className="grid gap-3">
          {filtered.map(ex => (
            <li key={ex.id} className="rounded-2xl border p-4">
              <div className="text-xs text-zinc-500">
                {ex.subject} • {ex.school === "college" ? "Collège" : "Lycée"} {ex.grade} • {ex.difficulty}
              </div>
              <div className="font-medium">{ex.title}</div>
              <button className="mt-2 rounded border px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Lancer
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
