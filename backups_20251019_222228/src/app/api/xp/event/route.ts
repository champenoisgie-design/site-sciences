// src/app/api/xp/event/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "../../../../lib/auth";
import { registerActivity } from "../../../../lib/xp";

export async function POST(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });

  const body = await req.json().catch(()=> ({} as any));
  const type = String(body.type || "generic");
  const out = await registerActivity(user.id, type);
  return NextResponse.json({ ok:true, streak: out });
}
