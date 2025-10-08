export type PlanKey = "normal" | "gold" | "platine";

// Prix indicatifs (interne)
export const PRICING = {
  currency: "EUR",
  plans: {
    normal: { monthly: 12.99, yearly: 9.99 },
    gold:   { monthly: 17.99, yearly: 14.99 },
    platine:{ monthly: 24.99, yearly: 24.99 },
  },
  features: [
    { key: "lessons_exercises", label: "Accès complet aux leçons et exercices" },
    { key: "tdah_focus", label: "Mode Focus (timers, pas-à-pas, UI anti-distraction)" },
    { key: "entry_tests", label: "Tests de départ / révision intelligente" },
    { key: "memo_ready", label: "Fiches mémo prêtes (PDF avec filigrane)" },
    { key: "memo_builder", label: "Fiches mémo personnalisées" },
    { key: "skins_badges", label: "Skins & badges de progression" },
    { key: "parents_dashboard", label: "Tableau Parents + e-mails de suivi" },
    { key: "support_priority", label: "Support prioritaire" },
    { key: "selected_mode_scope", label: "Mode sélectionné valable pour toutes les matières et tous les niveaux" },
    { key: "complementary_modes", label: "Modes complémentaires (TDAH, DYS, TSA, HPI) — add-ons valables pour toutes matières et tous niveaux" }
  ] as const,
  matrix: {
    normal: {
      selected_mode_scope: true,
      complementary_modes: false,
      lessons_exercises: true,
      memo_ready: true,
      memo_builder: false,
      parents_dashboard: false,
      entry_tests: true,
      tdah_focus: true,
      skins_badges: true,
      support_priority: false
    },
    gold: {
      selected_mode_scope: true,
      complementary_modes: false,
      lessons_exercises: true,
      memo_ready: true,
      memo_builder: true,
      parents_dashboard: true,
      entry_tests: true,
      tdah_focus: true,
      skins_badges: true,
      support_priority: false
    },
    platine: {
      selected_mode_scope: true,
      complementary_modes: false,
      lessons_exercises: true,
      memo_ready: true,
      memo_builder: true,
      parents_dashboard: true,
      entry_tests: true,
      tdah_focus: true,
      skins_badges: true,
      support_priority: true
    }
  }
} as const;

// Prix de base utilisés par le panier
// Achat à l’unité (chapitre)
export const CHAPTER_PRICING = {
  perChapterEUR: 1.99
} as const;


export const SUBJECT_PASS = {
  monthly: 6.99,
  yearly: 4.99,
  note: "Accès à une matière sur tous les niveaux."
} as const;

export const LEVEL_PASS = {
  monthly: 7.99,
  yearly: 5.99,
  note: "Accès à toutes les matières d’un niveau."
} as const;

export const MODE_ADDON = {
  monthly: 2.0, // prix indicatif par mode complémentaire
} as const;

// Bundles & promos (panier)
export const CART_RULES = {
  familyDiscountPct: 0.10, // -10% de réduction quand Mode famille est activé
  discount3Subjects: 0.10, // -10% si ≥ 3 matières
  discount4Subjects: 0.20, // -20% si 4 matières
  familyModeMultiplier: 1.0, // +30% pour mode famille
  first100PromoPct: 0.20, // -20% pour les 100 premiers abonnés
} as const;

// Compat anciens imports
export type PricesSnapshot = any;
