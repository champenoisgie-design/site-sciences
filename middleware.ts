// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PREFIXES = ["/", "/faq", "/tarifs", "/panier", "/register", "/login", "/api", "/_next", "/static", "/images", "/favicon"];
const PROTECTED_PREFIXES = ["/cours", "/exercices", "/multijoueur", "/parents", "/mon-compte"];

function isPublic(pathname: string) {
  return PUBLIC_PREFIXES.some(p => pathname === p || pathname.startsWith(p));
}
function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Laisse passer les assets, API et pages publiques
  if (isPublic(pathname)) return NextResponse.next();

  // Seulement sur les zones protégées
  if (!isProtected(pathname)) return NextResponse.next();

  // Cookie d'expiration d'essai
  const trialExp = req.cookies.get("trial_exp")?.value;
  if (!trialExp) return NextResponse.next();

  const exp = Date.parse(trialExp);
  if (!isNaN(exp) && exp < Date.now()) {
    const url = req.nextUrl.clone();
    url.pathname = "/panier";
    url.searchParams.set("trial", "expired");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
