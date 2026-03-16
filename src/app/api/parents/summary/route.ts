import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerAccessState } from "@/lib/access/serverAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(a.getTime() - b.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function parseSubjects(subjects: string[] | undefined, grades: string[] | undefined) {
  const g = (grades?.[0] ?? "").toString();
  const subs = (subjects ?? []).map((s) => ({ grade: g, subject: String(s) }));
  return subs;
}

export async function GET() {
  const me = await getCurrentUser();
  if (!me?.id) return NextResponse.json({ ok: true, kind: "GUEST" }, { status: 200 });

  const access = await getServerAccessState(me.id);

  // Last activity (truth): DeviceSession.lastSeenAt
  const lastSeen = await prisma.deviceSession.findFirst({
    where: { userId: me.id, revokedAt: null } as any,
    orderBy: { lastSeenAt: "desc" },
    select: { lastSeenAt: true },
  });

  const lastActiveAt = lastSeen?.lastSeenAt ? new Date(lastSeen.lastSeenAt) : null;
  const now = new Date();
  const inactivityDays = lastActiveAt ? daysBetween(now, lastActiveAt) : null;

  // Active subscription (truth): latest currentPeriodEnd
  const sub = await prisma.subscription.findFirst({
    where: { userId: me.id } as any,
    orderBy: { currentPeriodEnd: "desc" },
  });

  // Build “parent insights” snapshot (no fake progress, just structured)
  const globalAlerts: string[] = [];

  if (access.kind === "EXPIRED") globalAlerts.push("Abonnement expiré");
  if (access.kind === "PAYWALL") globalAlerts.push("Accès bloqué");
  if (inactivityDays !== null && inactivityDays >= 7) globalAlerts.push("Inactivité détectée (7 jours+)");

  const endsAt =
    access.kind === "FULL" && (access as any).endsAt ? new Date((access as any).endsAt).toISOString() : null;

  // Scope subjects/grades (truth)
  const perSubject = (() => {
    if (access.kind === "FULL") return parseSubjects((access as any).subjects, (access as any).grades);
    if (access.kind === "TRIAL") return [{ grade: String(access.grade), subject: String(access.subject) }];
    return [];
  })();

  // Metrics placeholders (truthful zeros until we connect progress tables)
  // Parents want: regularity, time, streaks, objectives.
  const weeklyMinutes = 0;
  const weeklySessions = 0;
  const streakDays = 0;
  const chaptersDoneThisWeek = 0;

  // Recommendations: actionable even at 0
  const recommendations: Array<{ title: string; detail: string; cta: { label: string; href: string; disabled?: boolean } }> = [];

  if (perSubject.length > 0) {
    const first = perSubject[0];
    recommendations.push({
      title: "Démarrage simple (10 minutes)",
      detail: `Commencer par un chapitre “Les bases” en ${first.subject} (${first.grade}).`,
      cta: { label: "Ouvrir le parcours", href: "/compte?tab=progression", disabled: true },
    });
    recommendations.push({
      title: "Rituel hebdomadaire",
      detail: "Objectif : 3 séances de 20 min / semaine. Mieux vaut régulier que long.",
      cta: { label: "Voir les objectifs", href: "/compte?tab=parents" },
    });
  }

  // Alerts per subject (truth-driven from inactivity + “no chapters started” until data exists)
  const subjectAlerts = perSubject.map((x) => {
    const alerts: string[] = [];
    alerts.push("Aucun chapitre commencé (données chapitres à brancher)");
    if (inactivityDays !== null && inactivityDays >= 7) alerts.push("Aucune activité récente");
    return { grade: x.grade, subject: x.subject, alerts };
  });

  return NextResponse.json({
    ok: true,
    kind: access.kind,
    access,
    subscription: sub
      ? {
          plan: sub.plan,
          grade: sub.grade,
          subjectsJson: sub.subjectsJson,
          status: sub.status,
          currentPeriodEnd: sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toISOString() : null,
        }
      : null,
    lastActiveAt: lastActiveAt ? lastActiveAt.toISOString() : null,
    inactivityDays,
    endsAt,
    globalAlerts,
    scope: perSubject,
    subjectAlerts,
    metrics: {
      weeklyMinutes,
      weeklySessions,
      streakDays,
      chaptersDoneThisWeek,
    },
    recommendations,
  });
}
