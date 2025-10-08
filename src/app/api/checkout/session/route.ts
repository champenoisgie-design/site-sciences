// src/app/api/checkout/session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRICE = {
  normal:   process.env.STRIPE_PRICE_NORMAL_MONTHLY || "",
  gold:     process.env.STRIPE_PRICE_GOLD_MONTHLY   || "",
  platine:  process.env.STRIPE_PRICE_PLATINE_MONTHLY|| "",
};

export async function POST(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });
  const body = await req.json().catch(()=> ({} as any));

  const url = new URL(req.url);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;

  const plan = String(body.plan || "normal") as "normal"|"gold"|"platine";
  const priceId = PRICE[plan];

  try {
    if (priceId) {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/panier?checkout=success`,
        cancel_url: `${origin}/panier?checkout=cancel`,
        customer_email: user.email || undefined,
        metadata: { userId: user.id, plan },
      });
      return NextResponse.json({ ok:true, url: session.url });
    } else {
      // Fallback test à montant libre si pas de PRICE configuré
      const amount = Number(body.amount || 0);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: { name: `Site Sciences (${plan})` },
            unit_amount: Math.max(100, Math.round(amount*100))
          },
          quantity: 1
        }],
        success_url: `${origin}/panier?checkout=success`,
        cancel_url: `${origin}/panier?checkout=cancel`,
        customer_email: user.email || undefined,
        metadata: { userId: user.id, plan },
      });
      return NextResponse.json({ ok:true, url: session.url });
    }
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "stripe_error" }, { status: 500 });
  }
}
