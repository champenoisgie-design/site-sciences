import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, verifyPassword, hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const me = await getCurrentUser()
    if (!me)
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }
    const dbUser = await prisma.user.findUnique({ where: { id: me.id! } })
    if (!dbUser || !dbUser.passwordHash) {
      return NextResponse.json({ error: 'no_password_set' }, { status: 400 })
    }
    const ok = await verifyPassword(currentPassword, dbUser.passwordHash)
    if (!ok)
      return NextResponse.json({ error: 'wrong_password' }, { status: 400 })

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { passwordHash },
    })
    await prisma.session.deleteMany({ where: { userId: dbUser.id } }) // force single-session

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
