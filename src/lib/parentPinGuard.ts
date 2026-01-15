import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { getSessionIdFromCookies } from "@/lib/auth/sessionId";

export async function isParentPinUnlocked(): Promise<boolean> {
  const user = await getUserFromSessionServer();
  if (!user) return false;

  const sessionId = await getSessionIdFromCookies();
  if (!sessionId) return false;

  try {
    const row = await prisma.parentPinSession.findUnique({
      where: { userId_sessionId: { userId: user.id, sessionId } },
    });
    return !!row && row.unlockedUntil > new Date();
  } catch {
    // si la table n'est pas encore migrée, on refuse sans crash
    return false;
  }
}

export async function requireParentPinUnlocked() {
  const ok = await isParentPinUnlocked();
  if (!ok) {
    const err = new Error("PARENT_PIN_REQUIRED");
    // @ts-expect-error tag
    err.code = "PARENT_PIN_REQUIRED";
    throw err;
  }
}

export async function consumeParentPinUnlocked() {
  const user = await getUserFromSessionServer();
  if (!user) return;

  const sessionId = await getSessionIdFromCookies();
  if (!sessionId) return;

  // Force re-PIN next time (one-shot)
  await prisma.parentPinSession.updateMany({
    where: { userId: user.id, sessionId },
    data: { unlockedUntil: new Date(Date.now() - 60_000) },
  });
}

