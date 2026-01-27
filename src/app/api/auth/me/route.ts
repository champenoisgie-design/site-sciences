import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const u = await getCurrentUser()
  if (!u?.id) return NextResponse.json({ user: null })

  // Source de vérité: DB user (trial fields)
  const dbUser = await prisma.user.findUnique({
    where: { id: u.id },
    select: {
      id: true,
      email: true,
      name: true,
      trialStartAt: true,
      trialEndsAt: true,
      trialGrade: true,
      trialSubject: true,
    },
  })

  return NextResponse.json({ user: dbUser ?? null })
}
