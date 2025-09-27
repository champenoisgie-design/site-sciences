import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'demo@sitesciences.fr'
  const password = 'Demo12345!' // (≥ 8 caractères)
  const hash = await bcrypt.hash(password, 10)

  // 1) User de test (upsert pour éviter les doublons)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Compte Démo',
      email,
      passwordHash: hash,
    },
  })

  // 2) Progression de test (XP + badgesJson)
  const progressItems = [
    { subject: 'Maths',          grade: 'Terminale', xp: 180, badges: ['Calculateur', 'Algebre Avancée'] },
    { subject: 'Physique-Chimie',grade: 'Terminale', xp: 140, badges: ['Mécanique 1', 'Énergie'] },
    { subject: 'SVT',            grade: '1re',       xp: 90,  badges: ['Cellule', 'Génétique'] },
  ]

  for (const p of progressItems) {
    await prisma.userProgress.upsert({
      where: { userId_subject_grade: { userId: user.id, subject: p.subject, grade: p.grade } },
      update: { xp: p.xp, badgesJson: JSON.stringify(p.badges) },
      create: { userId: user.id, subject: p.subject, grade: p.grade, xp: p.xp, badgesJson: JSON.stringify(p.badges) },
    })
  }

  console.log('\n✅ Seed terminé.')
  console.log('   Identifiants de test :')
  console.log('   Email   :', email)
  console.log('   Mot de passe :', password, '\n')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
