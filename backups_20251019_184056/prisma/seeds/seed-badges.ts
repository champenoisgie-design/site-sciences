import prisma from '@/lib/prisma'

async function main() {
  const data = [
    {
      key: 'sub_first',
      name: 'Première souscription',
      description: 'Bravo pour ton premier abonnement !',
    },
    {
      key: 'pack3_sub',
      name: 'Pack 3',
      description: 'Tu as pris le pack 3 matières.',
    },
  ]
  for (const b of data) {
    await prisma.badge.upsert({
      where: { key: b.key },
      update: { name: b.name, description: b.description },
      create: b,
    })
  }
  console.log('✅ Badges seedés.')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
