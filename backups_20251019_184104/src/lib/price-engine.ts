// src/lib/price-engine.ts

/** Petits utilitaires */
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export type SubscriptionLine = {
  /** Prix de base pour CETTE ligne (après choix plan + facturation) */
  basePrice: number;
  /** Nombre de matières sélectionnées (pour remise 3/4 matières) */
  subjectsCount: number;
  /** Libellés facultatifs (plan, niveau, etc.) — purement descriptif */
  meta?: Record<string, string | number | boolean | null | undefined>;
};

export type CartInput = {
  currency?: string; // ex: "EUR"
  /** Ligne principale (abonnement n°1) */
  primary: SubscriptionLine;
  /** Optionnel : abonnement n°2 (mode Famille) */
  familySecond?: SubscriptionLine | null;

  /** Drapeaux de remises globales */
  hasReferral?: boolean;  // Parrainage (-5%)
  isFirst100?: boolean;   // Promo 100 premiers (-20%)

  /** Paramètres (override possibles) */
  discount3SubjectsPct?: number;   // défaut 0.10
  discount4SubjectsPct?: number;   // défaut 0.20
  familyDiscountPct?: number;      // défaut 0.10 (uniquement sur la ligne famille)
  referralPct?: number;            // défaut 0.05
  first100PromoPct?: number;       // défaut 0.20
};

export type CartTotals = {
  currency: string;
  lines: {
    primary: {
      base: number;
      subjectsCount: number;
      subjectDiscountPct: number;
      subjectDiscountAmount: number;
      subtotal: number;
      meta?: SubscriptionLine["meta"];
    };
    familySecond?: {
      base: number;
      subjectsCount: number;
      subjectDiscountPct: number;
      subjectDiscountAmount: number;
      subtotal: number;
      meta?: SubscriptionLine["meta"];
      familyDiscountPct: number;
      familyDiscountAmount: number;
      subtotalAfterFamily: number;
    } | null;
  };
  discounts: {
    referralPct: number;
    referralAmount: number;
    first100Pct: number;
    first100Amount: number;
  };
  totals: {
    /** Somme des lignes après remises 3/4 matières (et famille si applicable) */
    afterLineLevelDiscounts: number;
    /** Total final après parrainage / first100 */
    grandTotal: number;
  };
};

export function subjectsDiscountPct(subjectsCount: number, d3 = 0.10, d4 = 0.20) {
  if (subjectsCount >= 4) return d4;
  if (subjectsCount >= 3) return d3;
  return 0;
}

/**
 * Calcule tous les montants et renvoie un récap détaillé et stable (arrondi 2 décimales).
 * On applique l'ordre suivant :
 *  1) Remise matières (3/4) par ligne (primary + famille)
 *  2) Remise famille (-10%) sur la ligne famille uniquement
 *  3) Remises panier : parrainage (-5%), puis first100 (-20%) en séquence
 */
export function computeCartTotals(input: CartInput): CartTotals {
  const currency = input.currency ?? "EUR";
  const d3 = input.discount3SubjectsPct ?? 0.10;
  const d4 = input.discount4SubjectsPct ?? 0.20;
  const familyPct = input.familyDiscountPct ?? 0.10;
  const referralPct = input.referralPct ?? 0.05;
  const first100Pct = input.first100PromoPct ?? 0.20;

  // Ligne principale
  const p = input.primary;
  const pSubjPct = subjectsDiscountPct(p.subjectsCount, d3, d4);
  const pSubjAmt = round2(p.basePrice * pSubjPct);
  const pSubtotal = round2(p.basePrice - pSubjAmt);

  // Ligne famille (facultatif)
  let f: CartTotals["lines"]["familySecond"] = null;
  if (input.familySecond && input.familySecond.basePrice > 0) {
    const fLine = input.familySecond;
    const fSubjPct = subjectsDiscountPct(fLine.subjectsCount, d3, d4);
    const fSubjAmt = round2(fLine.basePrice * fSubjPct);
    const fSubtotal = round2(fLine.basePrice - fSubjAmt);
    const fFamilyAmt = round2(fSubtotal * familyPct);
    const fAfterFamily = round2(fSubtotal - fFamilyAmt);
    f = {
      base: round2(fLine.basePrice),
      subjectsCount: fLine.subjectsCount,
      subjectDiscountPct: fSubjPct,
      subjectDiscountAmount: fSubjAmt,
      subtotal: fSubtotal,
      meta: fLine.meta,
      familyDiscountPct: familyPct,
      familyDiscountAmount: fFamilyAmt,
      subtotalAfterFamily: fAfterFamily,
    };
  }

  // Somme après remises par ligne (et famille)
  const afterLineLevelDiscounts = round2(
    pSubtotal + (f ? f.subtotalAfterFamily : 0)
  );

  // Remises panier
  const referralAmount = input.hasReferral ? round2(afterLineLevelDiscounts * referralPct) : 0;
  const afterReferral = round2(afterLineLevelDiscounts - referralAmount);

  const first100Amount = input.isFirst100 ? round2(afterReferral * first100Pct) : 0;
  const grandTotal = round2(afterReferral - first100Amount);

  return {
    currency,
    lines: {
      primary: {
        base: round2(p.basePrice),
        subjectsCount: p.subjectsCount,
        subjectDiscountPct: pSubjPct,
        subjectDiscountAmount: pSubjAmt,
        subtotal: pSubtotal,
        meta: p.meta,
      },
      familySecond: f,
    },
    discounts: {
      referralPct,
      referralAmount,
      first100Pct,
      first100Amount,
    },
    totals: {
      afterLineLevelDiscounts,
      grandTotal,
    },
  };
}
