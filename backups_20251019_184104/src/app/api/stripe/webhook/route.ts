// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const buf = Buffer.from(await req.arrayBuffer());
  const sig = (req.headers.get("stripe-signature") || "");
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, secret);
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: `Webhook signature verification failed: ${err?.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any; // Stripe.Checkout.Session
    const userId = session?.metadata?.userId as string | undefined;
    const plan = (session?.metadata?.plan as string | undefined) || "normal";

    if (userId) {
      const ends = new Date(Date.now() + 30*24*3600*1000);
      await prisma.subscription.create({
        data: {
          userId,
          status: "active",
          plan,
          grade: "all",
          subjectsJson: "[]",
          stripeSubscriptionId: session?.subscription || null,
          currentPeriodEnd: ends,
        } as any
      }).catch(async () => {
        await prisma.subscription.updateMany({
          where: { userId, plan },
          data: { status: "active", currentPeriodEnd: ends, stripeSubscriptionId: session?.subscription || null }
        });
      });

      // Désactive toute période d’essai restante
      await prisma.subscription.updateMany({
        where: { userId, plan: "trial", currentPeriodEnd: { gte: new Date() } },
        data: { status: "canceled", currentPeriodEnd: new Date() }
      });
    }
  }

  return NextResponse.json({ received: true });
}
