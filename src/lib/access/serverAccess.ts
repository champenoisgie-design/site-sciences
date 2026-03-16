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

function parseSubjectsFromJson(subjectsJson: string | null | undefined): Array<{ grade?: string; subject?: string }> {
  if (!subjectsJson) return [];
  try {
    const j = JSON.parse(subjectsJson);
    const raw = String(j?.subjects || "");
    if (!raw) return [];
    // raw format: "4e:Physique-Chimie|4e:Maths"
    return raw
      .split("|")
      .map((p: string) => p.trim())
      .filter(Boolean)
      .map((p: string) => {
        const i = p.indexOf(":");
        if (i <= 0) return null;
        const grade = p.slice(0, i).trim();
        const subject = p.slice(i + 1).trim();
        if (!grade || !subject) return null;
        return { grade, subject };
      })
      .filter(Boolean) as any;
  } catch {
    return [];
  }
}

/**
 * Verite serveur :
 * - Si abonnement actif => FULL scoped (grade+subjects)
 * - Sinon si abonnement expiré => EXPIRED
 * - Sinon si trial actif => TRIAL scoped (grade+subject)
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
      where: { userId, currentPeriodEnd: { not: null } } as any,
      orderBy: { currentPeriodEnd: "desc" },
    }),
  ]);

  if (activeSub) {
    const pairs = parseSubjectsFromJson(activeSub.subjectsJson);
    const subjects = Array.from(new Set(pairs.map((p) => p.subject).filter(Boolean))) as string[];
    const grades = Array.from(new Set(pairs.map((p) => p.grade).filter(Boolean))) as string[];
    return {
      kind: "FULL" as const,
      endsAt: activeSub.currentPeriodEnd ? new Date(activeSub.currentPeriodEnd) : undefined,
      plan: String(activeSub.plan || ""),
      subjects,
      grades,
    };
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

  // FULL scoped: if endpoint is specific to grade/subject, enforce it
  if (state.kind === "FULL") {
    if (!params.requested) return;
    const okSubject = Array.isArray((state as any).subjects) && (state as any).subjects.includes(params.requested.subject);
    // grades optional: if we have grades list, enforce too
    const grades = (state as any).grades as string[] | undefined;
    const okGrade = !grades || grades.length === 0 || grades.includes(params.requested.grade);
    if (okSubject && okGrade) return;
    throw new HttpError(403, { error: "SUBSCRIPTION_SCOPE_FORBIDDEN" });
  }

  if (state.kind === "TRIAL") {
    if (!params.requested) return;
    const ok = params.requested.grade === state.grade && params.requested.subject === state.subject;
    if (ok) return;
    throw new HttpError(403, { error: "TRIAL_SCOPE_FORBIDDEN" });
  }

  throw new HttpError(402, { error: "PAYWALL_REQUIRED" });
}
