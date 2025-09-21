import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, createSessionForUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'missing' }, { status: 400 })
    if (String(password).length < 8) return NextResponse.json({ error: 'weak_password' }, { status: 400 })

    const rec = await prisma.passwordResetToken.findUnique({ where: { token } })
    if (!rec || rec.expires < new Date()) return NextResponse.json({ error: 'invalid_or_expired' }, { status: 400 })

    const passwordHash = await hashPassword(password)
    await prisma.user.update({ where: { id: rec.userId }, data: { passwordHash } })
    await prisma.passwordResetToken.delete({ where: { token } })
    await prisma.session.deleteMany({ where: { userId: rec.userId } })
    await createSessionForUser(rec.userId) // reconnecte directement
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
