// src/app/api/trial/grant/route.ts
import { NextResponse } from "next/server";
import { grantTrial } from "../../../../lib/trial";
import { getSessionUser } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || user.email || "").trim().toLowerCase();
    if (!email) return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });

    const headers = Object.fromEntries((req.headers ?? new Headers()).entries());
    const deviceInfo = {
      userAgent: headers["user-agent"] ?? "",
      language: headers["accept-language"] ?? "",
      timezone: body.tz ?? "",
      ip: headers["x-forwarded-for"]?.split(",")[0]?.trim() || ""
    };

    const out = await grantTrial({
      userId: user.id,
      email,
      learningMode: body.learningMode ?? "normal",
      deviceInfo
    });
    if (!out.ok) return NextResponse.json(out, { status: 409 });
    {
      const res = NextResponse.json(out as any);
      const ends = (out as any)?.endsAt ? new Date((out as any).endsAt) : null;
      if (ends) {
        res.cookies.set("trial_exp", ends.toISOString(), {
          path: "/",
          httpOnly: false,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production"
        });
      }
      return res;
    }
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
