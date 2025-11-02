import type { AppliedDiscounts, BillingPeriod, CartItem } from "./types";

/**
 * Central pricing logic (pure + tested easily).
 * Default policy: if both annual & family are true, DO NOT stack (cap at the best single discount = 20%).
 * If env PRICING_ENABLE_COMBO === 'true', apply a single -30% combo instead.
 */
export function applyDiscounts(
  items: CartItem[],
  period: BillingPeriod,
  distinctLevelsCount: number
) {
  const subtotalCents = items.reduce((s, it) => s + Math.max(0, it.priceCents), 0);

  const annualEligible = period === "Annuel";
  const familyEligible = distinctLevelsCount >= 2;
  const comboEnabled = process.env.PRICING_ENABLE_COMBO === "true";

  let applied: AppliedDiscounts = { annual: false, family: false, combo: false };
  let discountCents = 0;
  const details: Array<{ label: string; amountCents: number }> = [];

  if (subtotalCents === 0) {
    return { subtotalCents, discountCents: 0, totalCents: 0, applied, details };
  }

  // Percentages expressed as basis points for accuracy.
  const PCT = {
    ANNUAL: 2000, // 20%
    FAMILY: 2000, // 20%
    COMBO: 3000,  // 30%
  } as const;

  if (annualEligible && familyEligible && comboEnabled) {
    const d = Math.floor((subtotalCents * PCT.COMBO) / 10000);
    discountCents += d;
    applied = { annual: true, family: true, combo: true };
    details.push({ label: "Réduction combo Annuel + Famille (−30%)", amountCents: -d });
  } else if (annualEligible || familyEligible) {
    // max-single policy: pick the larger single discount (here equal at 20%).
    const dAnnual = annualEligible ? Math.floor((subtotalCents * PCT.ANNUAL) / 10000) : 0;
    const dFamily = familyEligible ? Math.floor((subtotalCents * PCT.FAMILY) / 10000) : 0;

    if (dAnnual >= dFamily) {
      if (dAnnual > 0) {
        discountCents += dAnnual;
        applied.annual = true;
        details.push({ label: "Réduction annuel (−20%)", amountCents: -dAnnual });
      }
    } else {
      discountCents += dFamily;
      applied.family = true;
      details.push({ label: "Pack Famille (−20%)", amountCents: -dFamily });
    }
  }

  const totalCents = Math.max(0, subtotalCents - discountCents);
  return { subtotalCents, discountCents, totalCents, applied, details };
}

export function formatEuro(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function deriveDistinctLevelsCount(items: CartItem[]) {
  const levels = new Set(items.map((i) => i.level).filter(Boolean) as string[]);
  return levels.size;
}
