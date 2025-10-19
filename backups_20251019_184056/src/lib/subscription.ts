import prisma from '@/lib/prisma'

export async function getUserSubscription(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: 'active' },
    orderBy: { createdAt: 'desc' },
  })

  return sub
}
