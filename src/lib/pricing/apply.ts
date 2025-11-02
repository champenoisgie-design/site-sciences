import type { AppliedDiscounts, BillingPeriod, CartItem } from "./types";

/** Clamp / sanitation pour éviter NaN & valeurs négatives. */
export function getSafeCents(n: unknown): number {
  const v = Math.floor(Number(n));
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function eur(nCents: number) {
  return (nCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

/** Comptage des niveaux distincts, seulement pour les items 'subject'. */
function countDistinctLevels(items: CartItem[]): number {
  const levels = new Set<string>();
  for (const i of items) {
    if (i.type === "subject" && i.level) levels.add(i.level);
  }
  return levels.size;
}

export function priceCart(opts: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number; // facultatif si déjà connu côté appelant
  enableCombo?: boolean;        // PRICING_ENABLE_COMBO
}) {
  const { items, period } = opts;
  const subtotalCents = items.reduce((acc, it) => acc + getSafeCents((it as any).priceCents), 0);

  const annual = period === "Annuel";
  const family = (typeof opts.distinctLevelsCount === "number"
    ? opts.distinctLevelsCount
    : countDistinctLevels(items)) >= 2;

  const combo = !!opts.enableCombo && annual && family;

  // Règle: on applique UN seul taux: combo 30% sinon 20% (annual ou family), sinon 0
  const rate = combo ? 0.30 : (annual || family) ? 0.20 : 0.0;
  const discountCents = Math.floor(subtotalCents * rate);
  const totalCents = Math.max(0, subtotalCents - discountCents);

  const appliedDiscounts: AppliedDiscounts = {
    annual,
    family,
    combo: combo || undefined,
  };

  return {
    subtotalCents,
    subtotalHuman: eur(subtotalCents),
    rate,
    discountCents,
    discountHuman: eur(discountCents),
    totalCents,
    totalHuman: eur(totalCents),
    appliedDiscounts,
  };
}
