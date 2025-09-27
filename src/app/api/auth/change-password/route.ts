import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

const prisma = (globalThis as any).__prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalThis as any).__prisma = prisma;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json({ error: "Mot de passe trop court (min. 8)" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return NextResponse.json({ error: "user not found" }, { status: 404 });

  // Si l'utilisateur a déjà un hash, on vérifie l'ancien
  if (dbUser.passwordHash) {
    const ok = await bcrypt.compare(String(currentPassword || ""), dbUser.passwordHash);
    if (!ok) return NextResponse.json({ error: "Mot de passe actuel invalide" }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });

  return NextResponse.json({ ok: true });
}
