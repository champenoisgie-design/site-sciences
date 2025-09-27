import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PrismaClient } from '@prisma/client';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

const prisma = (globalThis as any).__prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') (globalThis as any).__prisma = prisma;

// --- Helpers
async function awardBadge(userId: string, badgeKey: string, meta?: unknown) {
  try {
    await prisma.userBadge.upsert({
      where: { userId_badgeKey: { userId, badgeKey } },
      update: {},
      create: { userId, badgeKey, metaJson: meta ? JSON.stringify(meta) : null },
    });
  } catch {
    // pas bloquant
  }
}

function monthsStep(prev: Date | null, next: Date): number {
  if (!prev) return 1;
  const diffMs = next.getTime() - prev.getTime();
  const days = diffMs / (1000 * 60 * 60 * 24);
  if (days >= 27 && days <= 45) return 1;     // ~1 mois
  if (days > 45) return 1;                    // gros trou => on repart
  return 0;                                   // paiement trop rapproché => pas de +1
}

async function updateStreak(userId: string, newPeriodEndSec?: number | null) {
  if (!newPeriodEndSec) return;
  const newEnd = new Date(newPeriodEndSec * 1000);
  const current = await prisma.userBillingStreak.findUnique({ where: { userId } });

  if (!current) {
    await prisma.userBillingStreak.create({ data: { userId, consecutiveMonths: 1, lastPeriodEnd: newEnd } });
    return 1;
  }

  const step = monthsStep(current.lastPeriodEnd, newEnd);
  const nextCount = step === 0 ? current.consecutiveMonths : (current.consecutiveMonths || 0) + 1;

  const updated = await prisma.userBillingStreak.update({
    where: { userId },
    data: { consecutiveMonths: step === 0 ? current.consecutiveMonths : nextCount, lastPeriodEnd: newEnd },
  });

  return updated.consecutiveMonths;
}

async function maybeAwardStreakBadges(userId: string, count?: number | null) {
  if (!count) return;
  if (count >= 3)  await awardBadge(userId, 'streak_3');
  if (count >= 6)  await awardBadge(userId, 'streak_6');
  if (count >= 12) await awardBadge(userId, 'streak_12');
}

// --- Webhook handler
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const whsec = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, whsec);
  } catch (err: any) {
    console.error('WEBHOOK_SIGNATURE_FAILED', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId ?? null;
        const plan = (session.metadata?.plan ?? '').toLowerCase(); // bronze | gold | platine
        const subscriptionId = session.subscription as string | null;

        if (userId) {
          // badge d’accueil + badge du plan
          await awardBadge(userId, 'sub_first', { sessionId: session.id });
          if (plan === 'bronze')  await awardBadge(userId, 'sub_bronze');
          if (plan === 'gold')    await awardBadge(userId, 'sub_gold');
          if (plan === 'platine') await awardBadge(userId, 'sub_platine');

          // init/maj streak avec la fin de période
          let periodEnd: number | undefined;
          if (subscriptionId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            periodEnd = sub.current_period_end ?? undefined;
          }
          const count = await updateStreak(userId, periodEnd);
          await maybeAwardStreakBadges(userId, count);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string | undefined;

        if (customerId) {
          const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId }, select: { id: true } });
          if (user) {
            // récupérer une fin de période
            let periodEnd: number | undefined;
            const line = invoice.lines?.data?.[0];
            periodEnd = line?.period?.end ?? undefined;

            if (!periodEnd && invoice.subscription) {
              const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
              periodEnd = sub.current_period_end ?? undefined;
            }

            const count = await updateStreak(user.id, periodEnd);
            await maybeAwardStreakBadges(user.id, count);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string | undefined;
        if (customerId) {
          const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId }, select: { id: true } });
          if (user) {
            await prisma.userBillingStreak.upsert({
              where: { userId: user.id },
              update: { consecutiveMonths: 0, lastPeriodEnd: null },
              create: { userId: user.id, consecutiveMonths: 0, lastPeriodEnd: null },
            });
          }
        }
        break;
      }

      default:
        // autres événements ignorés
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('WEBHOOK_HANDLER_ERROR', e);
    return NextResponse.json({ error: 'handler error' }, { status: 500 });
  }
}
