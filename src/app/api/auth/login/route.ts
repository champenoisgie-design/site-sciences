import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword, createSessionForUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, remember } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'missing' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) return NextResponse.json({ error: 'invalid_credentials' }, { status: 400 })
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'invalid_credentials' }, { status: 400 })
    await createSessionForUser(user.id, { remember: !!remember })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
