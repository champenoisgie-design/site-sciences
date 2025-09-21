import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ici tu peux brancher un envoi réel (SMTP, service tiers, etc.)
    console.log("[CONTACT] payload:", body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
