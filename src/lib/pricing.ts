import type { AnyGrade, Subject } from "@/lib/school"
import { subjects } from "@/lib/school"

/**
 * Barème de base (€/mois) PAR MATIÈRE et PAR NIVEAU — prix égaux entre matières.
 * (Tu peux ajuster ces montants facilement ici.)
 */
export const basePriceByGrade: Record<AnyGrade, number> = {
  "6e": 12,
  "5e": 12,
  "4e": 13,
  "3e": 13,
  "2nde": 15,
  "1re": 17,
  "Terminale": 19,
}

/**
 * Multiplicateurs par niveau d’abonnement.
 * Normal = 1x, Gold = 1.3x, Platine = 1.7x (à adapter si besoin).
 */
export type Tier = "Normal" | "Gold" | "Platine"
export const tierMultiplier: Record<Tier, number> = {
  Normal: 1.0,
  Gold: 1.3,
  Platine: 1.7,
}

/**
 * Avantages affichés par palier (pour la page).
 */
export const tierBenefits: Record<Tier, string[]> = {
  Normal: [
    "Tutoriels complets",
    "Entraînement Solo illimité",
    "Suivi XP/Badges",
  ],
  Gold: [
    "Tout le palier Normal",
    "Support prioritaire e-mail",
    "Défis mensuels exclusifs",
  ],
  Platine: [
    "Tout le palier Gold",
    "Live mensuel (groupe)",
    "Parcours & révisions avancés",
  ],
}

/** Prix par matière pour un niveau & un palier (arrondi au €). */
export function pricePerSubject(grade: AnyGrade, tier: Tier): number {
  const base = basePriceByGrade[grade]
  return Math.round(base * tierMultiplier[tier])
}

/** Détail des prix par matière. */
export function perSubjectPricing(grade: AnyGrade, tier: Tier) {
  return subjects.map((s: Subject) => ({
    subject: s,
    price: pricePerSubject(grade, tier),
  }))
}

/**
 * Pack 3 matières : prend la somme des 3 matières, puis applique une remise.
 * Ici: -20% sur le total (toutes classes), à ajuster si souhaité.
 */
export function pack3Subjects(grade: AnyGrade, tier: Tier) {
  const unit = pricePerSubject(grade, tier)
  const sum = unit * subjects.length
  const discounted = Math.round(sum * 0.8) // 20% de remise
  return {
    packPrice: discounted,
    saved: sum - discounted,
    sum,
  }
}
