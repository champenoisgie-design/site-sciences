import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * ONE-SHOT parent PIN:
 * - Si unlockedUntil < now => 423 {code:PARENT_PIN_REQUIRED}
 * - Si ok => autorise MAIS on peut consommer l'unlock après l'action (Stripe)
 *
 * Hypothèse: table ParentPinSession (userId, sessionId, unlockedUntil)
 * sessionId doit être le même que celui utilisé par /api/parent-pin/status
 */

export async function parentPin423() {
  return NextResponse.json({ code: "PARENT_PIN_REQUIRED" }, { status: 423 });
}

export async function isParentPinUnlocked(userId: string, sessionId: string): Promise<boolean> {
  const row = await prisma.parentPinSession.findFirst({
    where: { userId, sessionId },
    select: { unlockedUntil: true },
  });
  if (!row?.unlockedUntil) return false;
  return row.unlockedUntil.getTime() > Date.now();
}

/**
 * Garde: renvoie NextResponse (423) si lock, sinon null.
 */
export async function requireParentPinOr423(userId: string, sessionId: string) {
  const ok = await isParentPinUnlocked(userId, sessionId);
  if (!ok) return parentPin423();
  return null;
}

/**
 * Consomme l'unlock (pour forcer "PIN à chaque action").
 * Appeler à la fin d'une route Stripe juste avant return.
 */
export async function consumeParentPin(userId: string, sessionId: string) {
  await prisma.parentPinSession.updateMany({
    where: { userId, sessionId },
    data: { unlockedUntil: new Date(Date.now() - 60_000) },
  });
}
