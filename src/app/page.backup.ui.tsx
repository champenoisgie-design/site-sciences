"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useSelection } from "@/components/SelectionProvider"
import type { School, AnyGrade, Subject } from "@/lib/school"
import { gradesBySchool, subjects } from "@/lib/school"

export default function Page() {
  const { selection, setSchool, setGrade, setSubject } = useSelection()

  const availableGrades = useMemo<AnyGrade[]>(
    () => (selection.school ? gradesBySchool[selection.school] : []),
    [selection.school],
  )

  return (
    <section className="grid gap-10 md:grid-cols-2 md:items-start">
      <div>
        <h1 className="text-3xl font-bold">Site Sciences</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Ressources, tutoriels et entraînements adaptés à ton niveau.
        </p>

        {/* Sélecteurs imbriqués */}
        <div className="mt-6 grid gap-4 rounded-2xl border p-4">
          {/* École */}
          <div>
            <label className="mb-1 block text-sm font-medium">École</label>
            <div className="flex gap-2">
              {(["college", "lycee"] as School[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSchool(s)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    selection.school === s
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {s === "college" ? "Collège" : "Lycée"}
                </button>
              ))}
            </div>
          </div>

          {/* Niveau */}
          <div>
            <label className="mb-1 block text-sm font-medium">Niveau</label>
            <div className="flex flex-wrap gap-2">
              {availableGrades.length === 0 && (
                <span className="text-xs text-zinc-500">Choisis d’abord Collège ou Lycée</span>
              )}
              {availableGrades.map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    selection.grade === g
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Matière */}
          <div>
            <label className="mb-1 block text-sm font-medium">Matière</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map(m => (
                <button
                  key={m}
                  onClick={() => setSubject(m)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    selection.subject === m
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              SVT = Sciences de la Vie et de la Terre (intitulé officiel).
            </p>
          </div>

          {/* Accès directs */}
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/tutoriels"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Voir les tutoriels
              </Link>
              <Link
                href="/solo"
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Entraînement solo
              </Link>
              <Link
                href="/tarifs"
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Tarifs adaptés
              </Link>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Les contenus et les prix s’adaptent à ta sélection.
            </p>
          </div>
        </div>
      </div>

      {/* Bloc d’aperçu */}
      <div className="rounded-2xl border p-4">
        <h2 className="text-lg font-semibold">Ta sélection</h2>
        <ul className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>École : {selection.school ? (selection.school === "college" ? "Collège" : "Lycée") : "—"}</li>
          <li>Niveau : {selection.grade ?? "—"}</li>
          <li>Matière : {selection.subject ?? "—"}</li>
        </ul>
        <p className="mt-4 text-xs text-zinc-500">
          Le thème visuel change selon la matière ; les listes Tutoriels & Solo se filtrent selon le niveau/matière.
        </p>
      </div>
    </section>
  )
}
