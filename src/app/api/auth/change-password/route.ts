import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, verifyPassword, hashPassword, createSessionForUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const me = await getCurrentUser()
    if (!me?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const { oldPassword, newPassword } = await req.json()
    if (!oldPassword || !newPassword) return NextResponse.json({ error: 'missing' }, { status: 400 })
    if (String(newPassword).length < 8) return NextResponse.json({ error: 'weak_password' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { id: me.id } })
    if (!user?.passwordHash) return NextResponse.json({ error: 'no_password' }, { status: 400 })
    const ok = await verifyPassword(oldPassword, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'invalid_old_password' }, { status: 400 })

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({ where: { id: me.id }, data: { passwordHash } })
    await prisma.session.deleteMany({ where: { userId: me.id } })
    await createSessionForUser(me.id) // recrée une nouvelle session
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
