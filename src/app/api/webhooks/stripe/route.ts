import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { withMeta } from "@/lib/prisma-safe";
import { genId } from "@/lib/id";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const buf = await req.text();

  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {});

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Invalid signature: ${err?.message}` }, { status: 400 });
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const stripeSub: Stripe.Subscription = event.data.object as Stripe.Subscription;

    const userId = (stripeSub.metadata?.userId as string) || "user_demo";
    const plan = (stripeSub.items?.data?.[0]?.price?.nickname || stripeSub.items?.data?.[0]?.price?.id || "normal").toString();
    const currentPeriodEnd = (stripeSub as any).current_period_end ? new Date((stripeSub as any).current_period_end * 1000) : null;

    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: stripeSub.id },
      create: withMeta({
        id: genId("sub"),
        userId,
        plan,
        grade: "",                // placeholder si ton modèle l'exige
        subjectsJson: "[]",       // placeholder si ton modèle l'exige
        status: stripeSub.status,
        stripeSubscriptionId: stripeSub.id,
        currentPeriodEnd
      }, "sub"),
      update: { status: stripeSub.status, currentPeriodEnd, updatedAt: new Date() }
    });

    return NextResponse.json({ ok: true });
  }

  // autres événements: 200 OK no-op
  return NextResponse.json({ ok: true });
}
