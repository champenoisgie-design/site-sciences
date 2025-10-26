import { NextResponse } from "next/server";

/**
 * Portail de facturation (Stripe) TEMPORAIREMENT désactivé en dev
 * => redirection propre avec un paramètre, en attendant les vraies clés.
 */
export async function GET(req: Request) {
  const { origin } = new URL(req.url);
  return NextResponse.redirect(new URL("/compte/preferences?billing=portal_unavailable", origin));
}
