import { prisma } from "./prisma";

/**
 * Vérifie si l'email est autorisé via la liste TEACHER_ALLOWLIST.
 * Exemple: TEACHER_ALLOWLIST=prof1@ecole.fr,prof2@lycee.fr
 */
export function isTeacherAllowed(email?: string | null): boolean {
  if (!email) return false;
  const list = (process.env.TEACHER_ALLOWLIST ?? "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

/**
 * Active le mode prof pour un utilisateur SI son email est allowlisté.
 * Retourne true si activé (ou déjà actif), false sinon.
 * Requis par: /api/prof/enable
 */
export async function enableTeacherIfAllowlisted(userId: string, email?: string | null): Promise<boolean> {
  if (!isTeacherAllowed(email)) return false;

  // Modèle attendu: TeacherMembership avec unique (userId)
  await prisma.teacherMembership.upsert({
    where: { userId },
    update: { enabled: true },
    create: { userId, enabled: true },
  });

  return true;
}

/**
 * Indique si l'utilisateur a le mode prof (flag DB OU allowlist par email).
 * Requis par: /api/prof/* et page /prof
 */
export async function hasTeacherMode(userId: string, email?: string | null): Promise<boolean> {
  if (isTeacherAllowed(email)) return true;
  const tm = await prisma.teacherMembership.findUnique({ where: { userId }, select: { enabled: true } });
  return Boolean(tm?.enabled);
}

/** Création (idempotente) du lien prof → élève. Requis par: /api/prof/students */
export async function createTeacherStudentLink(teacherUserId: string, studentUserId: string) {
  await prisma.teacherStudentLink.upsert({
    where: { teacherUserId_studentUserId: { teacherUserId, studentUserId } },
    update: {},
    create: { teacherUserId, studentUserId },
  });
}

/** Alias exporté pour matcher les imports existants */
export const addStudentLink = createTeacherStudentLink;

/** Liste des élèves liés à un prof (infos de base). */
export async function listStudentsForTeacher(teacherUserId: string) {
  const links = await prisma.teacherStudentLink.findMany({
    where: { teacherUserId },
    orderBy: { createdAt: "asc" },
  });

  if (links.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: links.map(l => l.studentUserId) } },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const byId = new Map(users.map(u => [u.id, u]));
  return links.map(l => ({
    studentUserId: l.studentUserId,
    email: byId.get(l.studentUserId)?.email ?? null,
    name: byId.get(l.studentUserId)?.name ?? null,
    linkedAt: l.createdAt,
    createdAt: byId.get(l.studentUserId)?.createdAt ?? null,
  }));
}

/** Helper simple pour résoudre un userId depuis un email (utile côté API). */
export async function resolveUserIdByEmail(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  return user?.id ?? null;
}

export type ClassStudentSummary = {
  userId: string;
  email: string | null;
  name: string | null;
  streakCurrent: number;
  streakBest: number;
  activity14d: number;
  lastActivityAt: Date | null;
  badges: { badgeKey: string; earnedAt: Date }[];
};

/** Agrégations tableau de bord prof (/prof). */
export async function getClassSummary(teacherUserId: string): Promise<ClassStudentSummary[]> {
  const students = await listStudentsForTeacher(teacherUserId);
  if (students.length === 0) return [];

  const ids = students.map(s => s.studentUserId);
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  // Streaks
  const streaks = await prisma.userStreak.findMany({
    where: { userId: { in: ids } },
    select: { userId: true, current: true, best: true },
  });
  const streakById = new Map(streaks.map(s => [s.userId, s]));

  // Activité 14j (compte d'événements)
  const activities = await prisma.userActivity.groupBy({
    by: ["userId"],
    where: { userId: { in: ids }, createdAt: { gte: since } },
    _count: { _all: true },
  });
  const activityById = new Map(activities.map(a => [a.userId, a._count._all]));

  // Dernière activité
  const lastActs = await prisma.userActivity.findMany({
    where: { userId: { in: ids } },
    select: { userId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const lastById = new Map<string, Date>();
  for (const a of lastActs) if (!lastById.has(a.userId)) lastById.set(a.userId, a.createdAt);

  // Badges (5 récents)
  const badges = await prisma.userBadge.findMany({
    where: { userId: { in: ids } },
    select: { userId: true, badgeKey: true, earnedAt: true },
    orderBy: { earnedAt: "desc" },
  });
  const badgesById = new Map<string, { badgeKey: string; earnedAt: Date }[]>();
  for (const b of badges) {
    const arr = badgesById.get(b.userId) ?? [];
    if (arr.length < 5) {
      arr.push({ badgeKey: b.badgeKey, earnedAt: b.earnedAt });
      badgesById.set(b.userId, arr);
    }
  }

  return students.map(s => {
    const st = streakById.get(s.studentUserId);
    return {
      userId: s.studentUserId,
      email: s.email,
      name: s.name,
      streakCurrent: st?.current ?? 0,
      streakBest: st?.best ?? 0,
      activity14d: activityById.get(s.studentUserId) ?? 0,
      lastActivityAt: lastById.get(s.studentUserId) ?? null,
      badges: badgesById.get(s.studentUserId) ?? [],
    };
  });
}
