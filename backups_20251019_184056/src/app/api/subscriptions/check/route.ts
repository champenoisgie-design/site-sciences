import { NextResponse } from "next/server";
import { hasGlobalAccess } from "@/lib/access/subscription";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ ok:false, error:"unauthenticated" }, { status: 401 });

  const url = new URL(req.url);
  const learningMode = (url.searchParams.get("mode") || "normal") as "normal"|"tdah"|"dys";
  const ok = await hasGlobalAccess(user.id, learningMode);
  return NextResponse.json({ ok, learningMode });
}
