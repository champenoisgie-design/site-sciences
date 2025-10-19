// src/app/api/cart/price/route.ts
import { NextResponse } from "next/server";
import { computeCartTotals, type CartInput } from "../../../../lib/price-engine";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(()=> ({}))) as Partial<CartInput>;
    // Validation très souple : on exige juste primary.basePrice et subjectsCount
    if (!body?.primary || typeof body.primary.basePrice !== "number" || typeof body.primary.subjectsCount !== "number") {
      return NextResponse.json({ ok:false, error: "invalid_primary_line" }, { status: 400 });
    }
    const result = computeCartTotals(body as CartInput);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok:false, error: "server_error" }, { status: 500 });
  }
}

// Permet de ping en GET (optionnel)
export async function GET() {
  return NextResponse.json({ ok:true, hint: "POST with CartInput to compute totals" });
}
