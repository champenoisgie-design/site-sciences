import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
export async function POST(req: Request) {
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
  return NextResponse.json({ ok: true, url: session.url });
}
