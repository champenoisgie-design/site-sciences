import { cookies } from "next/headers";

/**
 * Next.js 15: cookies() is async in route handlers / server contexts.
 * We return a stable session id based on the HTTP-only cookie.
 *
 * Strategy:
 * 1) try preferred name ("session") first (detected previously)
 * 2) then try any cookie whose name includes "session"
 * 3) fallback: first non-empty cookie value
 */
export async function getSessionIdFromCookies(): Promise<string> {
  const store = await cookies();

  const preferred = "session";
  const v1 = store.get(preferred)?.value;
  if (v1) return v1;

  const all = store.getAll();
  const byName = all.find(c => /session/i.test(c.name) && c.value);
  if (byName?.value) return byName.value;

  const any = all.find(c => c.value);
  return any?.value ?? "";
}
