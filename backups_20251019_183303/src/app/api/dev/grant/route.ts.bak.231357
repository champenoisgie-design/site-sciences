import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user)
    return NextResponse.json({ ok: false, error: 'unauth' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'mode'
  const key = searchParams.get('key') || 'tdah'
  const plan = searchParams.get('plan')

  await prisma.userSubscription.upsert({
    where: { stripeSubId: `${user.id}-${type}-${key}-${plan || 'na'}` },
    update: { status: 'active' },
    create: {
      userId: user.id,
      type,
      key,
      plan: plan || undefined,
      status: 'active',
      stripeSubId: `${user.id}-${type}-${key}-${plan || 'na'}`,
    },
  })

  return NextResponse.json({
    ok: true,
    granted: { type, key, plan: plan || null },
  })
}
