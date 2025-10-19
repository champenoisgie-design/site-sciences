import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function readCookie(name: string): Promise<string | undefined> {
  const jar = await cookies(); // Next 15: await obligatoire
  return jar.get(name)?.value;
}

// Usage: return writeCookie(response, 'skin_active', value)
export function writeCookie<T extends Response>(
  res: T,
  name: string,
  value: string,
  opts: Record<string, any> = {}
): T {
  const r = new Response(res.body, res);
  r.headers.append(
    "Set-Cookie",
    `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
  );
  return r as T;
}
