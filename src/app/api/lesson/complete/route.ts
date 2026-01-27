import { genId } from '@/lib/id'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { awardBadge } from '@/lib/badges/award'
import { requireContentAccess, HttpError } from "@/lib/access/serverAccess";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, grade, xp = 10 } = await req.json().catch(() => ({}))
  if (!subject || !grade) {
    return NextResponse.json(
      { error: 'subject et grade requis' },
      { status: 400 },
    )
  }

  // PAYWALL / TRIAL SCOPE — vérité côté serveur
  try {
    await requireContentAccess({ userId: user.id, requested: { grade, subject } })
  } catch (e: any) {
    if (e instanceof HttpError) {
      console.log("[access] denied lesson/complete", { userId: user.id, grade, subject, status: e.status, error: e.body?.error })
      return NextResponse.json(e.body, { status: e.status })
    }
    console.error(e)
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }

  // Assure un enregistrement de progress
  const rec = await prisma.userProgress.upsert({
    where: { userId_subject_grade: { userId: user.id, subject, grade } as any },
    update: { xp: { increment: Number(xp) || 0 } },
    create: { id: genId(), userId: user.id, subject, grade, xp: Number(xp) || 0 },
  })

  // Badge "première leçon" (si tu veux l'utiliser: ajoute-le à la table Badge)
  try {
    await awardBadge(user.id, 'first_lesson')
  } catch {}

  return NextResponse.json(rec)
}
