import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const me = await getCurrentUser();
  if (!me?.id) return NextResponse.json({ ok: true, subscription: null }, { status: 200 });

  const sub = await prisma.subscription.findFirst({
    where: { userId: me.id } as any,
    orderBy: { currentPeriodEnd: "desc" },
  });

  return NextResponse.json({ ok: true, subscription: sub ?? null });
}
