import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()
  if (!user)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const email = user.email ?? undefined
  let customerId = (user as any).stripeCustomerId as string | undefined

  try {
    if (!customerId && email) {
      const list = await stripe.customers.list({ email, limit: 1 })
      if (list.data.length) customerId = list.data[0].id
    }
    if (!customerId)
      return NextResponse.json({ hasActive: false, entitlements: [] })

    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.items'],
      limit: 100,
    })

    const entitlements = subs.data.map((s: any) => {
      const m = s.metadata || {}
      return {
        id: s.id,
        status: s.status,
        plan: (m.plan as string) || undefined,
        kind: (m.kind as 'SUBJECT' | 'PACK3' | undefined) || 'SUBJECT',
        subject: (m.subject as string) || undefined,
        grade: (m.grade as string) || undefined,
      }
    })

    return NextResponse.json({
      hasActive: entitlements.length > 0,
      entitlements,
    })
  } catch (e) {
    console.error('BILLING_STATUS_ERROR', e)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
