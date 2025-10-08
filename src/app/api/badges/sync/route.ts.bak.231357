import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const runtime = 'nodejs'

const prisma = (globalThis as any).__prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') (globalThis as any).__prisma = prisma

// Badges initiaux (tu peux ajuster noms/points/emoji)
const BADGES = [
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
  {
    key: 'streak_6',
    name: 'Constante de Planck',
    description: '6 mois consécutifs',
    icon: '🚀',
    points: 150,
  },
  {
    key: 'streak_12',
    name: 'Prix Nobel de la régularité',
    description: '12 mois consécutifs',
    icon: '🏆',
    points: 300,
  },

  {
    key: 'pack3_sub',
    name: 'Triplé scientifique',
    description: 'Pack 3 matières actif',
    icon: '📚',
    points: 100,
  },
  {
    key: 'family_offer',
    name: 'Famille en orbite',
    description: 'Offre famille active',
    icon: '👨‍👩‍👧‍👦',
    points: 80,
  },
]

export async function POST(_req: NextRequest) {
  const results = []
  for (const b of BADGES) {
    const up = await prisma.badge.upsert({
      where: { key: b.key },
      update: {
        name: b.name,
        description: b.description ?? null,
        icon: b.icon ?? null,
        points: b.points,
      },
      create: {
        key: b.key,
        name: b.name,
        description: b.description ?? null,
        icon: b.icon ?? null,
        points: b.points,
      },
      select: { key: true },
    })
    results.push(up.key)
  }
  return NextResponse.json({ ok: true, upserted: results })
}
