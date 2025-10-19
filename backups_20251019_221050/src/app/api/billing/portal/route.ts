// src/app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });

  const url = new URL(req.url);
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${url.protocol}//${url.host}`;

  // On essaie de retrouver un stripe customer via l'abonnement
  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, stripeSubscriptionId: { not: null } },
    orderBy: { currentPeriodEnd: "desc" }
  });

  if (!sub?.stripeSubscriptionId) {
    // Pas d'abonnement connu => retour page préférences avec message
    return NextResponse.redirect(new URL("/compte/preferences?billing=unavailable", origin));
  }

  try {
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const customerId = typeof stripeSub.customer === "string" ? stripeSub.customer : stripeSub.customer?.id;
    if (!customerId) {
      return NextResponse.redirect(new URL("/compte/preferences?billing=unavailable", origin));
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/compte/preferences`
    });
    return NextResponse.redirect(portal.url);
  } catch (e:any) {
    return NextResponse.redirect(new URL("/compte/preferences?billing=error", origin));
  }
}
