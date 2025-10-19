import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { issueOtp } from "@/lib/otp";

export async function POST(req: Request) {
  // Rate limit: 3 requêtes / 5 minutes
  const ip = (req as any).ip || null;
  if (!rateLimit({ key: "otp-issue", limit: 3, refillMs: 300_000, ip })) {
    return NextResponse.json({ error: "Trop de demandes de code. Réessayez plus tard." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const { userId, deviceHash, email } = body || {};
  if (!userId || !deviceHash || !email) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  await issueOtp({ userId, deviceHash, email });
  return NextResponse.json({ ok: true });
}
