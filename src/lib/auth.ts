import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type SimpleUser = { id: string; email?: string | null; name?: string | null };

export async function getSessionUser(): Promise<SimpleUser | null> {
  const jar = await cookies();
  const id = jar.get("user_id")?.value || jar.get("session_user_id")?.value;
  const email = jar.get("user_email")?.value || null;
  const name = jar.get("user_name")?.value || null;
  return id ? { id, email, name } : null;
}

// Alias compat
export const getCurrentUser = getSessionUser;

/**
 * createSessionForUser
 * - 2e param peut être une string (email) ou un objet { email?, name?, remember? }
 */
export async function createSessionForUser(
  userId: string,
  opts?: string | { email?: string | null; name?: string | null; remember?: boolean }
) {
  let email: string | null | undefined = undefined;
  let name: string | null | undefined = undefined;
  let remember = false;

  if (typeof opts === "string") {
    email = opts;
  } else if (opts && typeof opts === "object") {
    email = opts.email ?? null;
    name = opts.name ?? null;
    remember = !!opts.remember;
  }

  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30j vs 7j
  const res = NextResponse.json({ ok: true, userId });

  res.headers.append("Set-Cookie", `user_id=${encodeURIComponent(userId)}; Path=/; SameSite=Lax; Max-Age=${maxAge}`);
  if (email) {
    res.headers.append("Set-Cookie", `user_email=${encodeURIComponent(email)}; Path=/; SameSite=Lax; Max-Age=${maxAge}`);
  }
  if (name) {
    res.headers.append("Set-Cookie", `user_name=${encodeURIComponent(name)}; Path=/; SameSite=Lax; Max-Age=${maxAge}`);
  }
  return res;
}

export async function deleteCurrentSession() {
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", `user_id=; Path=/; Max-Age=0; SameSite=Lax`);
  res.headers.append("Set-Cookie", `user_email=; Path=/; Max-Age=0; SameSite=Lax`);
  res.headers.append("Set-Cookie", `user_name=; Path=/; Max-Age=0; SameSite=Lax`);
  return res;
}

// Stubs password (remplacer par vraie implémentation plus tard)
export async function verifyPassword(_plain: string, _hash: string): Promise<boolean> { return true; }
export async function hashPassword(plain: string): Promise<string> { return "hashed:" + plain; }
