import { NextResponse } from "next/server";
import { priceCart } from "@/lib/pricing/apply";

type BillingPeriod = "Mensuel" | "Annuel";
type CartItem =
  | { id: string; type: "subject"; title: string; level?: string; priceCents: number }
  | { id: string; type: "mode"; title: string; priceCents: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];
    const period: BillingPeriod = body?.period === "Annuel" ? "Annuel" : "Mensuel";
    const distinctLevelsCount: number | undefined =
      typeof body?.distinctLevelsCount === "number" ? body.distinctLevelsCount : undefined;

    const r = priceCart({
      items: items as any,
      period,
      distinctLevelsCount,
    });

    return NextResponse.json({
      subtotalCents: r.subtotalCents,
      subtotalHuman: r.subtotalHuman,

      discounts: {
        rate: r.rate,
        amountCents: r.discountCents,
        amountHuman: r.discountHuman,
        breakdown: r.discountBreakdown,
      },

      appliedDiscounts: r.appliedDiscounts,

      totalCents: r.totalCents,
      totalHuman: r.totalHuman,

      breakdown: r.breakdown,
    });
  } catch (e: any) {
    console.error("[/api/cart/price] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 500 });
  }
}
