import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

const prisma = (globalThis as any).__prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') (globalThis as any).__prisma = prisma

export async function GET() {
  const user = await getCurrentUser()
  if (!user)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const rows = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' },
  })

  const badges = rows.map((r: any) => ({
    key: r.badgeKey,
    earnedAt: r.earnedAt,
    meta: r.metaJson ? JSON.parse(r.metaJson) : null,
    badge: {
      key: r.badge.key,
      name: r.badge.name,
      description: r.badge.description,
      icon: r.badge.icon,
      points: r.badge.points,
    },
  }))

  return NextResponse.json({ badges })
}
