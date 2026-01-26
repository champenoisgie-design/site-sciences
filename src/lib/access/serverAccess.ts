import prisma from "@/lib/prisma";

export class HttpError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(body?.error || "HTTP_ERROR");
    this.status = status;
    this.body = body;
  }
}

/**
 * Verite serveur :
 * - Si abonnement actif (status=active && currentPeriodEnd >= now) => FULL
 * - Sinon si abonnement expiré (dernier abonnement avec currentPeriodEnd < now) => EXPIRED
 * - Sinon si trial actif => TRIAL (scope strict grade+subject)
 * - Sinon => PAYWALL
 */
export async function getServerAccessState(userId: string) {
  const now = new Date();

  const [user, activeSub, lastSub] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { trialStartAt: true, trialEndsAt: true, trialGrade: true, trialSubject: true },
    }),
    prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
        currentPeriodEnd: { gte: now },
      } as any,
      orderBy: { currentPeriodEnd: "desc" },
    }),
    prisma.subscription.findFirst({
      where: {
        userId,
        currentPeriodEnd: { not: null },
      } as any,
      orderBy: { currentPeriodEnd: "desc" },
    }),
  ]);

  if (activeSub) {
    return { kind: "FULL" as const };
  }

  if (lastSub?.currentPeriodEnd) {
    const end = new Date(lastSub.currentPeriodEnd);
    if (now > end) {
      return { kind: "EXPIRED" as const, endedAt: end, lastPlan: String(lastSub.plan || "") };
    }
  }

  if (user?.trialEndsAt && user.trialGrade && user.trialSubject) {
    const end = new Date(user.trialEndsAt);
    if (now < end) {
      return {
        kind: "TRIAL" as const,
        grade: String(user.trialGrade),
        subject: String(user.trialSubject),
        endsAt: end,
      };
    }
  }

  return { kind: "PAYWALL" as const };
}

export async function requireContentAccess(params: {
  userId: string;
  requested?: { grade: string; subject: string };
}) {
  const state = await getServerAccessState(params.userId);

  if (state.kind === "FULL") return;

  if (state.kind === "TRIAL") {
    if (!params.requested) return;
    const ok = params.requested.grade === state.grade && params.requested.subject === state.subject;
    if (ok) return;
    throw new HttpError(403, { error: "TRIAL_SCOPE_FORBIDDEN" });
  }

  // EXPIRED ou PAYWALL => paywall
  throw new HttpError(402, { error: "PAYWALL_REQUIRED" });
}
