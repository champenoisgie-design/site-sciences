// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { withMeta } from "@/lib/prisma-safe";

export async function awardFirstSteps(userId: string) {
  // suppose un modèle BadgeDef et UserBadge existent ; sinon on stocke un flag sur User
  try {
    const def = await prisma.badgeDef.findFirst({ where: { key: "first_steps" }});
    if (!def) return null;
    const exists = await prisma.userBadge.findFirst({ where: { userId, badgeDefId: def.id }});
    if (exists) return exists;
    return prisma.userBadge.create({ data: withMeta({ userId, badgeDefId: def.id, earnedAt: new Date() }, "ubg") });
  } catch {
    return null;
  }
}