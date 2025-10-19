// src/app/api/settings/learning-mode/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getLearningMode, setLearningMode } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });
  const mode = await getLearningMode(user.id);
  return NextResponse.json({ ok:true, mode });
}

export async function POST(req: Request) {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });
  const body = await req.json().catch(()=> ({} as any));
  const mode = String(body.mode || "normal");
  if (!["normal","tdah","dys","tsa","hpi"].includes(mode)) {
    return NextResponse.json({ ok:false, error:"bad_mode" }, { status: 400 });
  }
  const saved = await setLearningMode(user.id, mode as any);
  return NextResponse.json({ ok:true, mode: saved });
}
