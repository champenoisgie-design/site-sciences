"use client"
import { useMemo, useState } from "react"
import { gradesBySchool, subjects } from "@/lib/school"
import type { School, AnyGrade, Subject } from "@/lib/school"

const basePrices: Record<Subject, Record<AnyGrade, number>> = {
  "Maths": {
    "6e": 7, "5e": 7, "4e": 8, "3e": 8,
    "2nde": 10, "1re": 12, "Terminale": 14,
  },
  "Physique-Chimie": {
    "6e": 0 as any, "5e": 0 as any, "4e": 6, "3e": 7,
    "2nde": 10, "1re": 12, "Terminale": 14,
  },
  "SVT": {
    "6e": 6, "5e": 6, "4e": 7, "3e": 7,
    "2nde": 9, "1re": 11, "Terminale": 13,
  },
} as const

function monthlyPriceFor(subject: Subject, grade: AnyGrade) {
  const v = basePrices[subject][grade]
  return typeof v === "number" ? v : 0
}

export default function ClientPage() {
  const [school, setSchool] = useState<School | undefined>()
  const [grade, setGrade] = useState<AnyGrade | undefined>()

  const grades = useMemo(() => (school ? gradesBySchool[school] : []), [school])

  const perSubject = useMemo(() => {
    if (!grade) return []
    return subjects.map(s => ({ subject: s, price: monthlyPriceFor(s, grade) }))
  }, [grade])

  const terminaleBundle = useMemo(() => {
    if (grade !== "Terminale") return null
    const sum = subjects.reduce((acc, s) => acc + monthlyPriceFor(s, "Terminale"), 0)
    const promo = Math.max(0, sum - 35) // exemple : pack 3 matières à 35€ au lieu de la somme
    return { packPrice: 35, saved: promo }
  }, [grade])

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Tarifs</h1>

      {/* Sélecteurs pour simuler la grille */}
      <div className="mb-6 grid gap-4 rounded-2xl border p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">École</label>
          <div className="flex gap-2">
            {(["college","lycee"] as School[]).map(s => (
              <button
                key={s}
                onClick={() => { setSchool(s); setGrade(undefined) }}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  school === s ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {s === "college" ? "Collège" : "Lycée"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Niveau</label>
          <div className="flex flex-wrap gap-2">
            {grades.length === 0 && <span className="text-xs text-zinc-500">Choisis d’abord Collège ou Lycée</span>}
            {grades.map(g => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`rounded-lg border px-3 py-1.5 text-sm ${
                  grade === g ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille de prix par matière */}
      {grade ? (
        <div className="grid gap-4 md:grid-cols-3">
          {perSubject.map(t => (
            <div key={t.subject} className="rounded-2xl border p-5">
              <h2 className="text-lg font-semibold">{t.subject}</h2>
              <p className="mt-2 text-2xl font-bold">{t.price} € / mois</p>
              <ul className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li>• Tutoriels complets {grade}</li>
                <li>• Entraînement Solo illimité</li>
                <li>• Suivi XP/Badges</li>
              </ul>
              <a href="/contact" className="mt-4 inline-block rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900">
                S’abonner {t.subject}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Choisis un niveau pour afficher les prix par matière.</p>
      )}

      {/* Offre pack Terminale */}
      {terminaleBundle && (
        <div className="mt-6 rounded-2xl border p-5">
          <div className="mb-1 w-fit rounded-full bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
            Offre 3 matières Terminale
          </div>
          <p className="text-lg">
            Pack Maths + Physique-Chimie + SVT : <span className="font-semibold">{terminaleBundle.packPrice} € / mois</span>
            {terminaleBundle.saved > 0 && (
              <span className="text-green-600 dark:text-green-400"> (économie ~{terminaleBundle.saved} €)</span>
            )}
          </p>
        </div>
      )}

      {/* Offre Famille : multi-niveaux */}
      <div className="mt-6 rounded-2xl border p-5">
        <div className="mb-1 w-fit rounded-full bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
          Offre Famille
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Plusieurs niveaux au foyer (ex: 6e + Terminale) : remise progressive sur le total.
          Contacte-nous pour un devis packé et nominatif.
        </p>
        <a href="/contact" className="mt-3 inline-block rounded-lg border px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
          Demander un devis Famille
        </a>
      </div>
    </section>
  )
}
