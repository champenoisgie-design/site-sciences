// src/lib/access.ts
import { prisma } from "./prisma";
import { isTrialActive } from "./trial";

/** Retourne true si l'utilisateur a un abonnement payant actif (hors trial). */
export async function hasActivePaidSub(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "active", plan: { not: "trial" }, currentPeriodEnd: { gte: new Date() } },
    orderBy: { currentPeriodEnd: "desc" }
  });
  return Boolean(sub);
}

export async function getAccessInfo(userId: string) {
  const trial = await isTrialActive(userId);
  const paid = await hasActivePaidSub(userId);

  // calcul des jours restants si payant
  let paidDaysLeft = 0;
  if (paid) {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: "active", plan: { not: "trial" }, currentPeriodEnd: { gte: new Date() } },
      orderBy: { currentPeriodEnd: "desc" }
    });
    if (sub?.currentPeriodEnd) {
      const ms = new Date(sub.currentPeriodEnd).getTime() - Date.now();
      paidDaysLeft = ms > 0 ? Math.ceil(ms / (24*3600*1000)) : 0;
    }
  }

  return {
    hasAccess: paid || trial,
    paidActive: paid,
    trialActive: trial,
    paidDaysLeft
  };
}
