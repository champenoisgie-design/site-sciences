import { NextRequest, NextResponse } from "next/server";
import { applyDiscounts, deriveDistinctLevelsCount, formatEuro } from "@/lib/pricing/apply";
import type { CartPriceRequestBody, CartPriceResponseBody } from "@/lib/pricing/types";

export const dynamic = "force-dynamic"; // compute each time

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CartPriceRequestBody;

    if (!body || !body.period || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Requête invalide: period + items requis" },
        { status: 400 }
      );
    }

    const distinctLevelsCount =
      typeof body.distinctLevelsCount === "number"
        ? body.distinctLevelsCount
        : deriveDistinctLevelsCount(body.items);

    const { subtotalCents, discountCents, totalCents, applied, details } = applyDiscounts(
      body.items,
      body.period,
      distinctLevelsCount
    );

    const res: CartPriceResponseBody = {
      subtotalCents,
      discountCents,
      totalCents,
      totalHuman: formatEuro(totalCents),
      appliedDiscounts: {
        annual: applied.annual,
        family: applied.family,
        combo: applied.combo,
      },
      details,
    };

    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    console.error("/api/cart/price error", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
