import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export type Entitlements = {
  modes: string[]
  skins: string[]
  subjects: string[]
  packs: string[]
  plans: string[] // ex: ["normal","gold","platine"]
}

export function toCSV(arr: string[]) {
  return Array.from(new Set(arr)).join(',')
}

export async function computeEntitlements(
  userId: string,
): Promise<Entitlements> {
  const actives = await prisma.userSubscription.findMany({
    where: { userId, status: { in: ['active', 'trialing'] } },
  })

  const modes = actives.filter((a) => a.type === 'mode').map((a) => a.key)
  const skins = actives.filter((a) => a.type === 'skin').map((a) => a.key)
  const subjects = actives.filter((a) => a.type === 'subject').map((a) => a.key)
  const packs = actives.filter((a) => a.type === 'pack').map((a) => a.key)
  const plans = actives.filter((a) => a.plan).map((a) => a.plan!) as string[]

  return {
    modes: Array.from(new Set(modes)),
    skins: Array.from(new Set(skins)),
    subjects: Array.from(new Set(subjects)),
    packs: Array.from(new Set(packs)),
    plans: Array.from(new Set(plans)),
  }
}

export async function setEntitlementCookies(e: Entitlements) {
  const jar = await cookies()
  jar.set('ent_modes', toCSV(e.modes), { path: '/', maxAge: 60 * 60 * 24 * 30 })
  jar.set('ent_skins', toCSV(e.skins), { path: '/', maxAge: 60 * 60 * 24 * 30 })
  jar.set('ent_subjects', toCSV(e.subjects), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  jar.set('ent_packs', toCSV(e.packs), { path: '/', maxAge: 60 * 60 * 24 * 30 })
  jar.set('ent_plans', toCSV(e.plans), { path: '/', maxAge: 60 * 60 * 24 * 30 })
}
