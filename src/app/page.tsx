"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useSelection } from "@/components/SelectionProvider"
import type { School, AnyGrade } from "@/lib/school"
import { gradesBySchool, subjects } from "@/lib/school"
import ModeSwitcher from "@/components/ModeSwitcher"

export default function Page() {
  const { selection, setSchool, setGrade, setSubject } = useSelection()
  const availableGrades = useMemo<AnyGrade[]>(
    () => (selection.school ? gradesBySchool[selection.school] : []),
    [selection.school],
  )

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        {/* Bulle 1 : Sélection imbriquée */}
        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold mb-3">Sélection</h2>

          {/* École */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">École</label>
            <div className="flex gap-2">
              {(["college", "lycee"] as School[]).map((s) => (
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
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Niveau</label>
            <div className="flex flex-wrap gap-2">
              {availableGrades.length === 0 && (
                <span className="text-xs text-zinc-500">
                  Choisis d’abord Collège ou Lycée
                </span>
              )}
              {availableGrades.map((g) => (
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
              {subjects.map((m) => (
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
        </div>

        {/* Bulle 2 : Récapitulatif */}
        <div className="rounded-2xl border p-5">
          <h2 className="text-lg font-semibold mb-3">Ta sélection</h2>
          <ul className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <li>
              <span className="text-zinc-500">École :</span>{" "}
              {selection.school ? (selection.school === "college" ? "Collège" : "Lycée") : "—"}
            </li>
            <li>
              <span className="text-zinc-500">Niveau :</span>{" "}
              {selection.grade ?? "—"}
            </li>
            <li>
              <span className="text-zinc-500">Matière :</span>{" "}
              {selection.subject ?? "—"}
            </li>
          </ul>

          <p className="mt-4 text-xs text-zinc-500">
            Le thème visuel change selon la matière ; les pages Tutoriels & Solo
            se filtrent selon le niveau et la matière sélectionnés.
          </p>
        </div>
      </div>

      {/* Bulle 3 : Mode d’apprentissage */}
      <div className="rounded-2xl border p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Mode d’apprentissage</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Choisis le mode le plus confortable : Normal, TDAH, DYS (affichages
              adaptés).
            </p>
          </div>
          {/* on réutilise le composant existant */}
          <ModeSwitcher />
        </div>
      </div>

      {/* Trois bulles d’accès */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          href="/solo"
          className="block rounded-2xl border p-6 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
        >
          <h3 className="text-lg font-semibold">Entraînement Solo</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Séries d’exercices adaptées à ta sélection, avec suivi XP.
          </p>
        </Link>

        <Link
          href="/tutoriels"
          className="block rounded-2xl border p-6 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
        >
          <h3 className="text-lg font-semibold">Tutoriels</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Cours guidés + exemples interactifs par niveau/matière.
          </p>
        </Link>

        <Link
          href="/multi"
          className="block rounded-2xl border p-6 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
        >
          <h3 className="text-lg font-semibold">Multijoueur</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Défis live et coop (bientôt) — badges & classement.
          </p>
        </Link>
      </div>
    </section>
  )
}
