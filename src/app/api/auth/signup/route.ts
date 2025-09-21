import { NextResponse } from "next/server"

/**
 * Démo: renvoie ok=true. À remplacer par:
 * - création utilisateur (hash bcrypt)
 * - envoi mail de confirmation (si besoin)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("[SIGNUP DEMO]", body?.email)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
