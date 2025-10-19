// src/lib/parents.ts
import crypto from "node:crypto";
import { prisma } from "./prisma";

function startOfDayUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
function addDaysUTC(d: Date, n: number) {
  const x = new Date(d); x.setUTCDate(x.getUTCDate() + n); return x;
}

export async function listChildrenForParent(parentUserId: string) {
  const links = await prisma.parentLink.findMany({ where: { parentUserId } });
  return links.map(l => l.studentUserId);
}

export async function addChildLink(parentUserId: string, studentUserId: string) {
  await prisma.parentLink.create({ data: { id: crypto.randomUUID(), parentUserId, studentUserId } as any });
}

export async function getStudentProgressSummary(userId: string) {
  const to = startOfDayUTC(new Date());
  const from = addDaysUTC(to, -13);

  const activities = await prisma.userActivity.findMany({
    where: { userId, occurredAt: { gte: from, lte: addDaysUTC(to, 1) } },
    orderBy: { occurredAt: "asc" }
  });

  const perDay: Record<string, number> = {};
  for (let i = 0; i < 14; i++) {
    const d = addDaysUTC(from, i).toISOString().slice(0, 10);
    perDay[d] = 0;
  }
  for (const a of activities) {
    const key = startOfDayUTC(a.occurredAt).toISOString().slice(0,10);
    if (perDay[key] != null) perDay[key]++;
  }

  const streak = await prisma.userStreak.findUnique({ where: { userId } });
  const badges = await prisma.userBadge.findMany({ where: { userId }, orderBy: { earnedAt: "asc" } });

  return { perDay, total: activities.length, streak, badges };
}
