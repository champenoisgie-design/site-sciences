// @ts-nocheck
import { prisma } from "@/lib/prisma";

export async function queueParentInactivityEmail(userId: string) {
  const parent = await prisma.parentProfile.findFirst({ where: { userId, wantsReports: true }});
  if (!parent) return;
  // Ici: enqueue via ta file (BullMQ, etc.). POC: console log.
  console.log("[MAIL] Inactivité: envoyer à", parent.email);
}

export async function queueParentCongratsEmail(userId: string, chapterKey: string) {
  const parent = await prisma.parentProfile.findFirst({ where: { userId, wantsReports: true }});
  if (!parent) return;
  console.log("[MAIL] Félicitations: chapitre", chapterKey, " → ", parent.email);
}