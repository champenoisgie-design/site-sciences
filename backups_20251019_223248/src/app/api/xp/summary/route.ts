// src/app/api/xp/summary/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth";
import { getXPSummary } from "../../../../lib/xp";

export async function GET() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });
  const data = await getXPSummary(user.id);
  return NextResponse.json({ ok:true, ...data });
}
