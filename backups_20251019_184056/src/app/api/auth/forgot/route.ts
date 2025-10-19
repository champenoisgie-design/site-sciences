import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'missing' }, { status: 400 })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ ok: true })
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000)
    await prisma.passwordResetToken.create({
      data: { id: (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : (Math.random().toString(36).slice(2) + Date.now().toString(36))), token, userId: user.id, expires },
    })
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const resetUrl = `${base}/reset/${token}`
    await sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe — Site Sciences',
      text: `Bonjour,\n\nVoici votre lien de réinitialisation : ${resetUrl}\nIl est valable 1h.\n`,
      html: `<p>Bonjour,</p><p>Voici votre lien de réinitialisation :</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Valable 1h.</p>`,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
