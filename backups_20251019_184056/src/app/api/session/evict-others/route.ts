// src/app/api/session/evict-others/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { fpFromHeaders } from "../../../../lib/session-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });

  const deviceHash = fpFromHeaders(req.headers);
  await prisma.deviceSession.updateMany({
    where: { userId: user.id, deviceHash: { not: deviceHash }, revokedAt: null },
    data: { revokedAt: new Date() }
  });

  return NextResponse.json({ ok:true });
}
