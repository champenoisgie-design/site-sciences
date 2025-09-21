import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

const SESSION_COOKIE = 'sessionToken'
const DEFAULT_DAYS = 30
const REMEMBER_DAYS = 90

export async function hashPassword(plain: string) {
  const saltRounds = 10
  return bcrypt.hash(plain, saltRounds)
}
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

export async function createSessionForUser(userId: string, opts?: { remember?: boolean }) {
  // Invalide toutes les autres sessions -> une seule connexion active
  await prisma.session.deleteMany({ where: { userId } })
  const sessionToken = randomBytes(32).toString('hex')
  const days = opts?.remember ? REMEMBER_DAYS : DEFAULT_DAYS
  const expires = new Date(Date.now() + days*24*60*60*1000)
  await prisma.session.create({ data: { userId, sessionToken, expires } })
  const c = await cookies()
  c.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires,
  })
}

export async function deleteCurrentSession() {
  const c = await cookies()
  const token = c.get(SESSION_COOKIE)?.value
  if (token) {
    await prisma.session.deleteMany({ where: { sessionToken: token } })
    c.set(SESSION_COOKIE, '', { path: '/', expires: new Date(0) })
  }
}

export async function getCurrentUser() {
  const c = await cookies()
  const token = c.get(SESSION_COOKIE)?.value
  if (!token) return null
  const sess = await prisma.session.findUnique({ where: { sessionToken: token }, include: { user: true } })
  if (!sess || sess.expires < new Date()) {
    if (sess) await prisma.session.delete({ where: { id: sess.id } }).catch(()=>{})
    c.set(SESSION_COOKIE, '', { path: '/', expires: new Date(0) })
    return null
  }
  return sess.user
}
