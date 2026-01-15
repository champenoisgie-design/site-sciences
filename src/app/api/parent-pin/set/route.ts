import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromSessionServer } from "@/lib/auth/server";
import { hashPin } from "@/lib/pin";
import crypto from "crypto";

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
    
      const body = await req.json().catch(() => ({}));
      const pin = String(body?.pin ?? "");
    
      const pinHash = await hashPin(pin);
    
      const dbUser = await ensureDbUser(user);
  if (!dbUser) return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 400 });

  await prisma.user.update({
    where: { id: dbUser.id },
        data: {
          parentPinHash: pinHash,
          parentPinSetAt: new Date(),
          parentPinFailed: 0,
          parentPinLockedUntil: null,
        },
      });
    
      return NextResponse.json({ ok: true });
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
