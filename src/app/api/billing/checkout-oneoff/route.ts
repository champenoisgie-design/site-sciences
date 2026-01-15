import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireParentPinUnlocked, consumeParentPinUnlocked } from "@/lib/parentPinGuard";
export async function POST(req: Request) {
  // Parents PIN required before checkout
  try {
    await requireParentPinUnlocked();
  } catch (e: any) {
    if (e?.code === "PARENT_PIN_REQUIRED" || e?.message === "PARENT_PIN_REQUIRED") {
      return new Response(JSON.stringify({ error: "PARENT_PIN_REQUIRED" }), {
        status:  423,
        headers: { "Content-Type": "application/json" },
      });
    }
    throw e;
  }

  const { items, success_url, cancel_url, customer_email } = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: (items ?? []).map((it: any) => ({
      price_data: {
        currency: "eur",
        product_data: { name: it.name },
        unit_amount: it.unit_amount_cents,
      },
      quantity: it.quantity ?? 1,
    })),
    success_url: success_url ?? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/checkout/success`,
    cancel_url: cancel_url ?? `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/checkout/cancel`,
    customer_email,
  });
  await consumeParentPinUnlocked();

  return NextResponse.json({ ok: true, url: session.url });
}
