// src/lib/session-guard.ts
import { prisma } from "./prisma";
import { deviceFingerprintCoarse } from "./privacy";

/** True si l'utilisateur a le mode Famille actif. */
export async function hasFamilyMode(userId: string) {
  // Source principale : table FamilyMembership
  const fam = await prisma.familyMembership.findUnique({ where: { userId } });
  if (fam?.enabled) return true;

  // Heuristique de secours : flag "family: true" dans subjectsJson d'un abonnement actif
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "active", currentPeriodEnd: { gte: new Date() } },
    orderBy: { currentPeriodEnd: "desc" },
  });
  if (sub?.subjectsJson) {
    try {
      const j = JSON.parse(sub.subjectsJson);
      if (j && typeof j === "object" && j.family === true) return true;
    } catch {
      // ignore JSON invalide
    }
  }
  return false;
}

/** Empreinte device/ip/lang/tz depuis les headers + éventuels overrides. */
export function fpFromHeaders(h: Headers, ua?: string | null, tz?: string | null): string {
  const ipRaw = h.get("x-forwarded-for") || h.get("x-real-ip") || "";
  const ip = ipRaw.split(",")[0].trim();
  const lang = h.get("accept-language") || "";
  const userAgent = ua || h.get("user-agent") || "";
  const timezone = tz || (Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  return deviceFingerprintCoarse({ userAgent, language: lang, timezone, ip });
}

/** Nombre de devices actifs (distincts) vus récemment. */
export async function activeDeviceCount(userId: string) {
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000); // fenêtre 30j
  const groups = await prisma.deviceSession.groupBy({
    by: ["deviceHash"],
    where: { userId, revokedAt: null, lastSeenAt: { gte: since } },
  });
  return groups.length;
}
