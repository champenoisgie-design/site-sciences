import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { getSessionIdFromCookies } from "@/lib/auth/sessionId";
import { verifyPin } from "@/lib/pin";
import crypto from "crypto";

const UNLOCK_MINUTES = 15;
const MAX_FAIL = 5;
const LOCK_MINUTES = 10;

async function ensureDbUser(user: any) {
  // user expected shape: { id?, email? }
  if (!user?.email) return null;

  // 1) try by id if provided
  if (user?.id) {
    const byId = await prisma.user.findUnique({ where: { id: user.id } });
    if (byId) return byId;
  }

  // 2) fallback by email (stable unique)
  const byEmail = await prisma.user.findUnique({ where: { email: user.email } });
  if (byEmail) return byEmail;

  // 3) create minimal user record if missing
  return prisma.user.create({
    data: {
      id: user?.id ?? crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      email: user.email,
      name: user.name ?? null,
      image: user.image ?? null,
      emailVerified: user.emailVerified ?? null,
    },
  });
}

export async function POST(req: Request) {
/*__SS_TRY_CATCH__*/
  try {
      const user = await getUserFromSessionServer();
      if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    
      const dbUser = await ensureDbUser(user);
      if (!dbUser?.parentPinHash) return NextResponse.json({ error: "PIN_NOT_SET" }, { status: 400 });
    
      if (dbUser.parentPinLockedUntil && dbUser.parentPinLockedUntil > new Date()) {
        return NextResponse.json({ error: "PIN_LOCKED", lockedUntil: dbUser.parentPinLockedUntil }, { status: 429 });
      }
    
      const body = await req.json().catch(() => ({}));
      const pin = String(body?.pin ?? "");
    
      const ok = await verifyPin(pin, dbUser.parentPinHash);
    
      if (!ok) {
        const failed = (dbUser.parentPinFailed ?? 0) + 1;
        const lockUntil = failed >= MAX_FAIL ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null;
    
        await prisma.user.update({
          where: { id: user.id },
          data: { parentPinFailed: failed, parentPinLockedUntil: lockUntil },
        });
    
        return NextResponse.json({ ok: false, error: "PIN_INVALID", failed, lockUntil }, { status: 400 });
      }
    
      // succès => reset compteur + unlock pour cette session
      await prisma.user.update({
        where: { id: user.id },
        data: { parentPinFailed: 0, parentPinLockedUntil: null },
      });
    
      const sessionId = await getSessionIdFromCookies();
      if (!sessionId) return NextResponse.json({ error: "NO_SESSION_ID" }, { status: 400 });
    
      const unlockedUntil = new Date(Date.now() + UNLOCK_MINUTES * 60_000);
    
      // IMPORTANT: si la table n'est pas migrée, on renvoie une erreur explicite plutôt que crash
      try {
        await prisma.parentPinSession.upsert({
          where: { userId_sessionId: { userId: user.id, sessionId } },
          update: { unlockedUntil },
          create: { userId: user.id, sessionId, unlockedUntil },
        });
      } catch (e) {
        return NextResponse.json({ error: "PARENT_PIN_TABLE_MISSING" }, { status: 500 });
      }
    
      return NextResponse.json({ ok: true, unlockedUntil });
  } catch (e: any) {
    // Toujours renvoyer un JSON, jamais une réponse vide
    const message = e?.message ?? "UNKNOWN_ERROR";
    const stack = process.env.NODE_ENV === "development" ? (e?.stack ?? null) : null;
    return (await import("next/server")).NextResponse.json(
      { error: "INTERNAL_ERROR", message, stack },
      { status: 500 }
    );
  }
}
