import { prisma } from "@/lib/prisma";

export async function hasGlobalAccess(userId: string, _learningMode: "normal"|"tdah"|"dys") {
  // S'aligne sur un modèle Subscription existant: status + currentPeriodEnd
  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["active", "trialing"] as any },
      currentPeriodEnd: { gte: now }
    }
  });
  return !!sub;
}

// Essai: no-op (à brancher sur Stripe "trial" plus tard)
export async function ensureTrial(userId: string, kind: "no-card-7d"|"with-card-3d") {
  const now = new Date();
  const ends = new Date(now.getTime() + (kind === "no-card-7d" ? 7 : 3) * 24 * 3600 * 1000);
  return { userId, kind, startedAt: now, endsAt: ends };
}

// Achat chapitre: no-op pour l’instant (sera géré via Stripe + DB dédiée)
export async function purchaseChapter(params: {
  userId: string; subject: string; level: string; chapterKey: string; priceCents: number;
}) {
  return { id: `${params.userId}:${params.subject}:${params.level}:${params.chapterKey}`, ...params, purchasedAt: new Date() };
}
