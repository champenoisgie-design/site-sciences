import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

// getCurrentUser robuste : si Session/User n'existent pas encore -> retourne null
export async function getCurrentUser() {
  try {
    const jar = await cookies()
    const token =
      jar.get('sessionToken')?.value ||
      jar.get('next-auth.session-token')?.value ||
      jar.get('next-auth.session')?.value ||
      jar.get('sessionId')?.value ||
      jar.get('sid')?.value ||
      null

    if (!token) return null

    // Si la table Session n'existe pas, l'appel ci-dessous lèvera P2021 -> catch => null
    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
    })
    if (!session) return null

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    return user || null
  } catch {
    return null
  }
}
