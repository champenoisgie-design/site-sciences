// src/lib/xp.ts
import { prisma } from "./prisma";
import { withMeta } from "./prisma-safe";

// Dictionnaire de badges (clé de stockage = badgeKey)
const BADGES = {
    "mode_active": { name: "Mode activé", description: "Un mode d’apprentissage a été choisi." },
premier_pas: { name: "Premier pas", description: "Premier exercice terminé." },
  streak_3:    { name: "Assidu 3",    description: "3 jours d'étude consécutifs." },
  streak_7:    { name: "Assidu 7",    description: "7 jours d'étude consécutifs." },
} as const;
type BadgeSlug = keyof typeof BADGES;

function dateUTC(date: Date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
function daysBetweenUTC(a: Date, b: Date) {
  const ms = dateUTC(a).getTime() - dateUTC(b).getTime();
  return Math.round(ms / (24 * 3600 * 1000));
}

export async function ensureStreak(userId: string) {
  let s = await prisma.userStreak.findUnique({ where: { userId } });
  if (!s) {
    // lastDate epoch pour que la 1re activité passe à 1
    s = await prisma.userStreak.create({
      data: withMeta({ userId, current: 0, best: 0, lastDate: new Date(0) })
    });
  }
  return s;
}

export async function awardBadge(userId: string, slug: BadgeSlug) {
  // badgeKey dans le schéma
  try {
    await prisma.userBadge.create({
      data: withMeta({ userId, badgeKey: slug, /* meta facultatif: */ metaJson: null })
    });
  } catch {
    // Unique (userId, badgeKey) déjà attribué -> on ignore
  }
}

export async function hasBadge(userId: string, slug: BadgeSlug) {
  const b = await prisma.userBadge.findFirst({ where: { userId, badgeKey: slug } });
  return Boolean(b);
}

export async function registerActivity(userId: string, type: string) {
  // Log activité
  await prisma.userActivity.create({ data: withMeta({ userId, type }) });

  // Streak
  let st = await ensureStreak(userId);
  const today = dateUTC();
  const delta = daysBetweenUTC(today, st.lastDate);

  if (delta === 0) {
    // même jour: pas d'incrément
  } else if (delta === 1) {
    st = await prisma.userStreak.update({
      where: { userId },
      data: { current: st.current + 1, best: Math.max(st.best, st.current + 1), lastDate: today }
    });
  } else {
    // trou (>1j) ou première activité: reset à 1
    st = await prisma.userStreak.update({
      where: { userId },
      data: { current: 1, best: Math.max(st.best, 1), lastDate: today }
    });
  }

  // Badges
  if (type === "exercise_completed" && !(await hasBadge(userId, "premier_pas"))) {
    await awardBadge(userId, "premier_pas");
  }
  if (st.current >= 3) await awardBadge(userId, "streak_3");
  if (st.current >= 7) await awardBadge(userId, "streak_7");

  return st;
}

export async function getXPSummary(userId: string) {
  const s = await ensureStreak(userId);
  const badges = await prisma.userBadge.findMany({
    where: { userId },
    orderBy: { earnedAt: "asc" } // champ du schéma existant
  });
  return {
    streak: { current: s.current, best: s.best, lastDate: s.lastDate },
    badges: badges.map(b => ({
      slug: b.badgeKey as BadgeSlug,
      name: BADGES[b.badgeKey as BadgeSlug]?.name ?? b.badgeKey
    }))
  };
}
