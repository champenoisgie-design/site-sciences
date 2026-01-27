import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { requireContentAccess, HttpError } from "@/lib/access/serverAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const me = await getCurrentUser();
  if (!me?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Endpoint "global" : autorisé si FULL ou TRIAL (sans scope demandé)
  try {
    await requireContentAccess({ userId: me.id });
  } catch (e: any) {
    if (e instanceof HttpError) return NextResponse.json(e.body, { status: e.status });
    console.error(e);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }

  // TODO: brancher vraies stats (UserProgress, etc.)
  return NextResponse.json({ ok: true, xp: 0, badges: [], streak: 0 });
}
