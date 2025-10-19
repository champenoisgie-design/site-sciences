// src/lib/trial.ts
import { prisma } from "./prisma";
import { withMeta } from "./prisma-safe";
import { hash, deviceFingerprintCoarse } from "./privacy";

/**
 * Vérifie si on peut accorder un essai 3 jours sans CB.
 * Politique: 1 essai par email + par appareil/foyer (deviceHash) sur une fenêtre de 90j.
 */
export async function canGrantTrial(params: {
  email: string;
  deviceInfo: { userAgent?: string | null; language?: string | null; timezone?: string | null; ip?: string | null; };
}) {
  const emailHash = hash(params.email.toLowerCase());
  const deviceHash = deviceFingerprintCoarse(params.deviceInfo);
  const windowAgo = new Date(Date.now() - 90 * 24 * 3600 * 1000);

  // Email déjà utilisé ?
  const byEmail = await prisma.trialLog.findFirst({ where: { emailHash } });
  if (byEmail) {
    return { ok: false as const, reason: "email_used" };
  }

  // Appareil/IP récent ?
  const recent = await prisma.trialLog.findFirst({
    where: {
      OR: [
        { deviceHash },
        { ip: params.deviceInfo.ip || undefined }
      ],
      createdAt: { gte: windowAgo }
    }
  });
  if (recent) {
    return { ok: false as const, reason: "device_or_ip_recent_trial" };
  }

  return { ok: true as const, emailHash, deviceHash };
}

/**
 * Accorde l'essai: crée Subscription(plan="trial") avec currentPeriodEnd=now()+3j
 * et enregistre un TrialLog pour l’anti-abus.
 * (Adapté au schéma Subscription actuel: status/grade/subjectsJson/currentPeriodEnd)
 */
export async function grantTrial(params: {
  userId: string;
  email: string;
  learningMode?: string; // conservé pour compat future, non stocké ici
  deviceInfo: { userAgent?: string | null; language?: string | null; timezone?: string | null; ip?: string | null; };
}) {
  const { ok, emailHash, deviceHash, reason } = await canGrantTrial({ email: params.email, deviceInfo: params.deviceInfo });
  if (!ok) return { ok, reason };

  const currentPeriodEnd = new Date(Date.now() + 3 * 24 * 3600 * 1000);

  await prisma.subscription.create({ data: withMeta({ userId: params.userId,
      status: "active",
      plan: "trial",
      grade: "all",
      subjectsJson: "[]",
      stripeSubscriptionId: null,
      currentPeriodEnd }) });

  await prisma.trialLog.create({
    data: {
      userId: params.userId,
      emailHash: emailHash!,
      deviceHash: deviceHash!,
      ip: params.deviceInfo.ip || undefined
    }
  });

  return { ok: true as const, endsAt: currentPeriodEnd };
}

export async function isTrialActive(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, plan: "trial", currentPeriodEnd: { gte: new Date() } },
    orderBy: { currentPeriodEnd: "desc" }
  });
  return Boolean(sub);
}

export async function trialDaysLeft(userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: { userId, plan: "trial" },
    orderBy: { currentPeriodEnd: "desc" }
  });
  if (!sub || !sub.currentPeriodEnd) return 0;
  const ms = new Date(sub.currentPeriodEnd).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / (24 * 3600 * 1000)) : 0;
}
