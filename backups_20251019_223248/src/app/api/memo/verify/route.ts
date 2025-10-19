// src/app/api/memo/verify/route.ts
import { NextResponse } from "next/server";
import { hash } from "../../../../lib/privacy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const u = url.searchParams.get("u") || "";
    const t = url.searchParams.get("t") || "";
    const s = url.searchParams.get("s") || "";
    const sig = url.searchParams.get("sig") || "";

    const expected = hash([u, t, s].join("|"));
    const ok = expected === sig;

    return NextResponse.json({
      ok,
      userId: u,
      stamp: t,
      memoKey: s,
      message: ok ? "Signature valide" : "Signature invalide"
    }, { status: ok ? 200 : 400 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message || "server_error" }, { status: 500 });
  }
}
