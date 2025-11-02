import { NextResponse } from "next/server";

type BillingPeriod = "Mensuel" | "Annuel";
type CartItem =
  | { id: string; type: "subject"; title: string; level?: string; priceCents: number }
  | { id: string; type: "mode"; title: string; priceCents: number };

function eur(nCents: number) {
  return (nCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];
    const period: BillingPeriod = (body?.period === "Annuel" ? "Annuel" : "Mensuel");
    const distinctLevelsCount: number | undefined =
      typeof body?.distinctLevelsCount === "number" ? body.distinctLevelsCount : undefined;

    const subtotalCents = items.reduce((acc, it) => acc + Math.max(0, Math.floor(it.priceCents || 0)), 0);

    const annual = period === "Annuel";
    const family = (distinctLevelsCount ?? 0) >= 2;

    const enableCombo = (process.env.PRICING_ENABLE_COMBO || "").toLowerCase() === "true";
    const combo = enableCombo && annual && family;

    // Applique la meilleure réduction unique: combo 30% sinon 20%.
    const rate = combo ? 0.30 : (annual || family) ? 0.20 : 0.0;
    const discountCents = Math.floor(subtotalCents * rate);
    const totalCents = Math.max(0, subtotalCents - discountCents);

    return NextResponse.json({
      subtotalCents,
      subtotalHuman: eur(subtotalCents),
      discounts: {
        rate,
        amountCents: discountCents,
        amountHuman: eur(discountCents),
      },
      appliedDiscounts: {
        annual,
        family,
        combo: combo || undefined,
      },
      totalCents,
      totalHuman: eur(totalCents),
    });
  } catch (e: any) {
    console.error("[/api/cart/price] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 500 });
  }
}
