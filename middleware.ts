import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Journalise quelques infos utiles (IP si disponible)
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown"
  const ua = req.headers.get("user-agent") ?? "ua-unknown"
  // En hébergement serverless, console.log va vers les logs du provider
  console.log("[visit]", { ip, ua, path: req.nextUrl.pathname })
  return
}

// On peut restreindre si besoin avec config.matcher
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}
