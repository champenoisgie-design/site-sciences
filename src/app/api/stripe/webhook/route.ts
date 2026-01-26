import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { withMeta } from "@/lib/prisma-safe";
import { genId } from "@/lib/id";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing env ${name}`);
  return v;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const rawBody = await req.text();

  let stripe: Stripe;
  try {
    stripe = new Stripe(mustEnv("STRIPE_SECRET_KEY"), { apiVersion: "2024-06-20" as any });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "stripe_init_failed" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  if (!webhookSecret) {
    return NextResponse.json({ ok: false, error: "Missing STRIPE_WEBHOOK_SECRET (whsec_...)" }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Invalid signature: ${err?.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;

        const stripeSubscriptionId = typeof s.subscription === "string" ? s.subscription : null;
        const stripeCustomerId = typeof s.customer === "string" ? s.customer : null;

        const userId = (s.metadata?.userId as string) || "";
        const plan = (s.metadata?.plan as string) || "unknown";
        const grade = (s.metadata?.grade as string) || "";
        const subjects = (s.metadata?.subjects as string) || "";

        if (userId && stripeCustomerId) {
          await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId } }).catch(() => {});
        }

        if (stripeSubscriptionId) {
          const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          const currentPeriodEnd = (sub as any).current_period_end
            ? new Date((sub as any).current_period_end * 1000)
            : null;

          await prisma.subscription.upsert({
            where: { stripeSubscriptionId },
            create: withMeta(
              {
                id: genId("sub"),
                userId: userId || "unknown",
                plan,
                grade,
                subjectsJson: JSON.stringify({ subjects }),
                status: sub.status,
                stripeSubscriptionId,
                currentPeriodEnd,
              },
              "sub"
            ),
            update: {
              status: sub.status,
              currentPeriodEnd,
              plan,
              grade,
              subjectsJson: JSON.stringify({ subjects }),
              updatedAt: new Date(),
            },
          });
        }

        return NextResponse.json({ ok: true });
      }

      case "invoice.payment_succeeded": {
        const inv = event.data.object as Stripe.Invoice;
        const stripeSubscriptionId = typeof inv.subscription === "string" ? inv.subscription : null;
        if (!stripeSubscriptionId) return NextResponse.json({ ok: true });

        const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const currentPeriodEnd = (sub as any).current_period_end
          ? new Date((sub as any).current_period_end * 1000)
          : null;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId },
          data: { status: sub.status, currentPeriodEnd, updatedAt: new Date() },
        });

        return NextResponse.json({ ok: true });
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const stripeSubscriptionId = sub.id;

        const currentPeriodEnd = (sub as any).current_period_end
          ? new Date((sub as any).current_period_end * 1000)
          : null;

        // metadata might be empty for some events; keep safe defaults
        const plan = (sub.metadata?.plan as string) || "unknown";
        const userId = (sub.metadata?.userId as string) || "unknown";
        const grade = (sub.metadata?.grade as string) || "";
        const subjects = (sub.metadata?.subjects as string) || "";

        // Prefer updateMany (no throw if row doesn't exist)
        const r = await prisma.subscription.updateMany({
          where: { stripeSubscriptionId },
          data: {
            status: sub.status,
            currentPeriodEnd,
            plan,
            grade,
            subjectsJson: JSON.stringify({ subjects }),
            updatedAt: new Date(),
          },
        });

        // If nothing updated, create a minimal row (idempotent)
        if (r.count === 0) {
          await prisma.subscription.create(
            withMeta(
              {
                id: genId("sub"),
                userId,
                plan,
                grade,
                subjectsJson: JSON.stringify({ subjects }),
                status: sub.status,
                stripeSubscriptionId,
                currentPeriodEnd,
              },
              "sub"
            )
          ).catch(() => {});
        }

        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ ok: true });
    }
  } catch (e: any) {
    console.error("[stripe/webhook] handler error", {
      type: event?.type,
      message: e?.message,
      code: e?.code,
      meta: e,
    });
    // Never break Stripe retries for non-critical issues
    return NextResponse.json({ ok: true });
  }
}
