/* ----------------------------------------------------------------
   src/config/pricing.ts
   - Source de vérité pour prix, packs, modes, catalogue, Stripe
   - Renseigne les vrais prix (centimes) + priceIds Stripe plus tard
----------------------------------------------------------------- */

export type PlanKey = 'normal' | 'gold' | 'platine'
export type ModeKey = 'tdah' | 'dys' | 'tsa' | 'hpi'
export type PackKey = 'pack3' | 'family'

export const PLAN_LABELS: Record<PlanKey, string> = {
  normal: 'Normal',
  gold: 'Gold',
  platine: 'Platine',
}

export const MODE_LABELS: Record<ModeKey, string> = {
  tdah: 'TDAH',
  dys: 'DYS',
  tsa: 'TSA',
  hpi: 'HPI',
}

export const PACK_LABELS: Record<PackKey, string> = {
  pack3: 'Pack 3 matières',
  family: 'Pack Famille',
}

/** Prix provisoires (centimes) — À REMPLACER par tes valeurs quand tu me les donnes */
export const PRICING = {
  plans: { normal: 599, gold: 999, platine: 1499 } as Record<PlanKey, number>,
  packs: { pack3: 1999, family: 2999 } as Record<PackKey, number>,
  modes: { tdah: 299, dys: 299, tsa: 299, hpi: 299 } as Record<ModeKey, number>,

  /** -------- Catalogue matières --------
   *  Donne-moi la liste finale pour que je fige la structure.
   *  Tu peux déjà modifier/compléter la liste ci-dessous.
   *  Option niveau: ajoute level: ["college-6e","lycee-1re", ...] si spécifique */
  subjects: [
    { key: 'maths', label: 'Mathématiques' },
    { key: 'pc', label: 'Physique-Chimie' },
    { key: 'svt', label: 'SVT' },
    { key: 'fr', label: 'Français' },
    { key: 'hg', label: 'Histoire-Géographie' },
    // Exemple spécifique niveau :
    // { key: "spe-maths", label: "Spécialité Maths", level: ["lycee-1re","lycee-term"] },
  ] as const,

  /** -------- Stripe price IDs (à brancher plus tard) --------
   *  Mapping {clé -> priceId}. Renseigne quand tu les as.
   *  Clés suggérées : plan:normal|gold|platine, pack:pack3|family, mode:tdah|dys|tsa|hpi
   */
  stripePriceIds: {
    'plan:normal': '',
    'plan:gold': '',
    'plan:platine': '',
    'pack:pack3': '',
    'pack:family': '',
    'mode:tdah': '',
    'mode:dys': '',
    'mode:tsa': '',
    'mode:hpi': '',
  } as Record<string, string>,
} as const

/** Helpers */
export const centsToEuros = (cents?: number) =>
  typeof cents === 'number'
    ? (cents / 100).toFixed(2).replace('.', ',') + ' €'
    : '—'
