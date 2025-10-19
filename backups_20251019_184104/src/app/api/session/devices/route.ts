// src/app/api/session/devices/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fpFromHeaders } from "@/lib/session-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });

  const deviceHash = fpFromHeaders((req as any).headers as Headers);
  const sessions = await prisma.deviceSession.findMany({
    where: { userId: user.id, revokedAt: null },
    orderBy: { lastSeenAt: "desc" }
  });

  return NextResponse.json({
    ok:true,
    items: sessions.map(s => ({
      id: s.id,
      userAgent: s.userAgent,
      ip: s.ip,
      createdAt: s.createdAt,
      lastSeenAt: s.lastSeenAt,
      isCurrent: s.deviceHash === deviceHash
    }))
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });

  const body = await req.json().catch(()=> ({} as any));
  if (body?.action === "revoke" && typeof body?.id === "string") {
    await prisma.deviceSession.updateMany({ where: { id: body.id, userId: user.id }, data: { revokedAt: new Date() } });
    return NextResponse.json({ ok:true });
  }
  if (body?.action === "revoke_others") {
    const deviceHash = fpFromHeaders((req as any).headers as Headers);
    await prisma.deviceSession.updateMany({ where: { userId: user.id, deviceHash: { not: deviceHash }, revokedAt: null }, data: { revokedAt: new Date() } });
    return NextResponse.json({ ok:true });
  }
  return NextResponse.json({ ok:false, error:"bad_request" }, { status: 400 });
}
