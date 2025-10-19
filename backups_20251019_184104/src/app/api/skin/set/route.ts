import { NextResponse } from "next/server";
import { writeCookie } from "@/lib/cookies";

export async function POST(req: Request) {
  const { skin } = await req.json().catch(() => ({ skin: "" }));
  if (!skin) return NextResponse.json({ ok:false, error:"missing skin" }, { status: 400 });
  const res = NextResponse.json({ ok:true });
  return writeCookie(res, "skin_active", skin);
}
