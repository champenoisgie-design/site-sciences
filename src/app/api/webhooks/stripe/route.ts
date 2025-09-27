import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !secret) return NextResponse.json({ error: 'missing_signature' }, { status: 400 })

  let event
  try { event = stripe.webhooks.constructEvent(body, sig, secret) }
  catch (err:any) { return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 }) }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const subscriptionId = session.subscription as string | undefined
        const userId = session.metadata?.userId as string | undefined
        const plan = session.metadata?.plan as string | undefined
        const grade = session.metadata?.grade as string | undefined
        const subjects = session.metadata?.subjects as string | undefined
        if (subscriptionId && userId && plan && grade && subjects) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId)
          const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscriptionId },
            update: { status: sub.status, currentPeriodEnd: periodEnd },
            create: {
              userId, plan, grade,
              subjectsJson: subjects,
              status: sub.status,
              stripeSubscriptionId: subscriptionId,
              currentPeriodEnd: periodEnd,
            },
          })
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: sub.status, currentPeriodEnd: periodEnd },
        })
        break
      }
      default: break
    }
  } catch (e) {
    console.error('[Stripe webhook handler error]', e)
    return NextResponse.json({ received: true, error: 'handler_failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
