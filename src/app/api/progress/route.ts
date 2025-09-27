import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

function safeParse(j?: string | null) {
  if (!j) return []
  try {
    return JSON.parse(j)
  } catch {
    return []
  }
}

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const subject = searchParams.get('subject') || undefined
  const grade = searchParams.get('grade') || undefined

  if (subject && grade) {
    const rec = await prisma.userProgress.upsert({
      where: { userId_subject_grade: { userId: user.id, subject, grade } },
      update: {},
      create: { userId: user.id, subject, grade, xp: 0, badgesJson: '[]' },
    })
    return NextResponse.json({
      items: [{ ...rec, badges: safeParse(rec.badgesJson) }],
    })
  }

  const items = await prisma.userProgress.findMany({
    where: { userId: user.id },
    orderBy: [{ grade: 'asc' }, { subject: 'asc' }],
  })
  return NextResponse.json({
    items: items.map((i) => ({ ...i, badges: safeParse(i.badgesJson) })),
  })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user)
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { subject, grade, amount } = await req.json()
  if (!subject || !grade || typeof amount !== 'number')
    return NextResponse.json({ error: 'missing' }, { status: 400 })

  const rec = await prisma.userProgress.upsert({
    where: { userId_subject_grade: { userId: user.id, subject, grade } },
    update: { xp: { increment: amount } },
    create: { userId: user.id, subject, grade, xp: amount, badgesJson: '[]' },
  })

  return NextResponse.json({
    item: { ...rec, badges: safeParse(rec.badgesJson) },
  })
}
