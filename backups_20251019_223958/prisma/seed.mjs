import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Badges de base (upsert par clé primaire 'key')
  const baseBadges = [
    {
      key: 'sub_first',
      name: 'Bienvenue au labo',
      description: 'Premier abonnement activé',
      icon: '🎉',
      points: 50,
    },
    {
      key: 'sub_bronze',
      name: 'Bronzé·e des sciences',
      description: 'Abonné·e au plan Bronze',
      icon: '🥉',
      points: 20,
    },
    {
      key: 'sub_gold',
      name: 'Au top niveau Or',
      description: 'Abonné·e au plan Gold',
      icon: '🥇',
      points: 40,
    },
    {
      key: 'sub_platine',
      name: 'Platine – Classe ultime',
      description: 'Abonné·e au plan Platine',
      icon: '💎',
      points: 60,
    },
    {
      key: 'streak_3',
      name: 'Toujours là',
      description: '3 mois consécutifs',
      icon: '🔥',
      points: 80,
    },
  ]

  for (const b of baseBadges) {
    await prisma.badge.upsert({
      where: { key: b.key },
      update: {
        name: b.name,
        description: b.description,
        icon: b.icon,
        points: b.points,
      },
      create: {
        key: b.key,
        name: b.name,
        description: b.description,
        icon: b.icon,
        points: b.points,
      },
    })
  }

  // Donne un badge démo au user_demo si existe
  const userDemo = await prisma.user.findFirst({ where: { id: 'user_demo' } })
  if (userDemo) {
    await prisma.userBadge
      .upsert({
        where: {
          userId_badgeKey: { userId: userDemo.id, badgeKey: 'sub_first' },
        },
        update: {},
        create: { userId: userDemo.id, badgeKey: 'sub_first' },
      })
      .catch(async () => {
        // si la contrainte unique n'existe pas dans le schéma Prisma, on fait un findFirst fallback
        const exists = await prisma.userBadge.findFirst({
          where: { userId: userDemo.id, badgeKey: 'sub_first' },
        })
        if (!exists) {
          await prisma.userBadge.create({
            data: { userId: userDemo.id, badgeKey: 'sub_first' },
          })
        }
      })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
