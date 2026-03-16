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

export async function GET() {
  const me = await getCurrentUser();
  if (!me?.id) return NextResponse.json({ ok: true, kind: "GUEST" }, { status: 200 });

  const access = await getServerAccessState(me.id);

  // Last activity: use DeviceSession.lastSeenAt as truth for now (we already update via heartbeat)
  const lastSeen = await prisma.deviceSession.findFirst({
    where: { userId: me.id, revokedAt: null } as any,
    orderBy: { lastSeenAt: "desc" },
    select: { lastSeenAt: true },
  });

  const lastActiveAt = lastSeen?.lastSeenAt ? new Date(lastSeen.lastSeenAt) : null;
  const now = new Date();
  const inactivityDays = lastActiveAt ? daysBetween(now, lastActiveAt) : null;

  // Build a “progress snapshot” even if exercises are not implemented yet:
  // - chaptersTotal placeholder (12) but per-subject list is REAL (from access scope)
  // - completed/time start at 0 (no fake progress)
  const subjects: Array<{ grade: string; subject: string }> = [];

  if (access.kind === "FULL") {
    const grades = (access as any).grades || [];
    const subs = (access as any).subjects || [];
    const grade = (grades[0] ?? "").toString();
    for (const s of subs) subjects.push({ grade, subject: String(s) });
  }

  if (access.kind === "TRIAL") {
    subjects.push({ grade: String(access.grade), subject: String(access.subject) });
  }

  const perSubject = subjects.map((x) => {
    const chaptersTotal = 12; // TODO later: real count from Prisma chapters catalog
    const chaptersDone = 0;
    const timeMinutes = 0;

    const recommended = {
      title: `Les bases de ${x.subject}`,
      reason: chaptersDone === 0 ? "Idéal pour commencer" : "À approfondir",
      ctaDisabled: true,
    };

    const alerts: string[] = [];
    if (chaptersDone === 0) alerts.push("Aucun chapitre commencé");
    if ((inactivityDays ?? 0) >= 7) alerts.push("Aucune activité depuis 7 jours");

    return {
      grade: x.grade,
      subject: x.subject,
      progressPercent: chaptersTotal > 0 ? Math.round((chaptersDone / chaptersTotal) * 100) : 0,
      chaptersDone,
      chaptersTotal,
      timeMinutes,
      recommended,
      alerts,
      // time per chapter: starts empty -> later real
      chapters: Array.from({ length: chaptersTotal }).map((_, i) => ({
        id: `ch_${x.grade}_${x.subject}_${i + 1}`,
        title: `Chapitre ${i + 1}`,
        timeMinutes: 0,
        done: false,
      })),
    };
  });

  // Global alerts (truthful)
  const globalAlerts: string[] = [];
  if (access.kind === "EXPIRED") globalAlerts.push("Abonnement expiré");
  if (access.kind === "PAYWALL") globalAlerts.push("Accès bloqué");
  if (lastActiveAt && inactivityDays !== null && inactivityDays >= 7) globalAlerts.push("Inactivité détectée (7 jours+)");

  return NextResponse.json({
    ok: true,
    kind: access.kind,
    access,
    lastActiveAt: lastActiveAt ? lastActiveAt.toISOString() : null,
    inactivityDays,
    globalAlerts,
    perSubject,
  });
}
