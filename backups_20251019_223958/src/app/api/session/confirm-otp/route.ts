import { NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { verifyOtp } from "@/lib/otp";

/** Supporte headers() sync ou async selon l'environnement Next. */
async function getClientIp(req: Request): Promise<string | null> {
  try {
    const hMaybe: any = (nextHeaders as any)();
    const h = typeof hMaybe?.then === "function" ? await hMaybe : hMaybe;
    const fwd: string | null = h?.get?.("x-forwarded-for") ?? null;
    if (fwd) return fwd.split(",")[0].trim();
  } catch {
    // ignore
  }
  // @ts-ignore — selon runtime, req.ip peut exister
  return (req as any).ip ?? null;
}

export async function POST(req: Request) {
  // Rate-limit global (5/min/IP) pour limiter le bruteforce
  const ip = await getClientIp(req);
  if (!rateLimit({ key: "otp-confirm", limit: 5, refillMs: 60_000, ip })) {
    return NextResponse.json({ error: "Trop de tentatives, réessayez dans 1 minute." }, { status: 429 });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 });
  }

  const { userId, deviceHash, code } = body || {};
  if (!userId || !deviceHash || !code) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const ok = await verifyOtp({ userId, deviceHash, code });
  if (!ok) {
    return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 });
  }

  // Ici, ton code de création/validation de session device peut s'exécuter.
  // Ex: await createOrConfirmDeviceSession({ userId, deviceHash })

  return NextResponse.json({ ok: true });
}
