import type { AppliedDiscounts, BillingPeriod, CartItem } from "./types";
import { computeCartPriceV2 } from "../price-engine";

export function getSafeCents(n: unknown): number {
  const v = Math.floor(Number(n));
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function eur(nCents: number) {
  return (nCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function priceCart(opts: {
  items: CartItem[];
  period: BillingPeriod;
  distinctLevelsCount?: number;
}) {
  const period = opts.period === "Annuel" ? "Annuel" : "Mensuel";

  const r = computeCartPriceV2({
    items: opts.items as any,
    period,
    distinctLevelsCount: opts.distinctLevelsCount,
  });

  const appliedDiscounts: AppliedDiscounts = {
    annual: period === "Annuel",
    family: r.familyEligible,
  };

  return {
    subtotalCents: r.subtotalCents,
    subtotalHuman: eur(r.subtotalCents),

    rate: r.discounts.totalDiscountPct,

    discountCents: r.discounts.totalDiscountCents,
    discountHuman: eur(r.discounts.totalDiscountCents),

    discountBreakdown: {
      familyCents: r.discounts.familyCents,
      familyHuman: eur(r.discounts.familyCents),
      multiSubjectCents: r.discounts.multiSubjectCents,
      multiSubjectHuman: eur(r.discounts.multiSubjectCents),
    },

    totalCents: r.totalCents,
    totalHuman: eur(r.totalCents),

    appliedDiscounts,
    breakdown: r.breakdown,
  };
}
