// src/lib/settings.ts
import { prisma } from "./prisma";
import { awardBadge } from "./xp";

export async function getLearningMode(userId: string) {
  const s = await prisma.userSettings.findUnique({ where: { userId } });
  return s?.learningMode || "normal";
}

export async function setLearningMode(userId: string, mode: "normal"|"tdah"|"dys"|"tsa"|"hpi") {
  await prisma.userSettings.upsert({
    where: { userId },
    update: { learningMode: mode },
    create: { userId, learningMode: mode },
  });
  // Badge “mode activé”
  try { await awardBadge(userId, "mode_active"); } catch {}
  return mode;
}
