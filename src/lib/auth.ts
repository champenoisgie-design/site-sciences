import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export type SimpleUser = { id: string; email?: string | null; name?: string | null };

/**
 * Récupère l'utilisateur courant depuis les cookies HTTP.
 * Utilisé côté serveur (route /api/session/heartbeat, etc.).
 */
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
 * Crée la réponse HTTP avec les cookies de session.
 * ⚠️ IMPORTANT : on retourne le NextResponse, à utiliser directement
 * depuis la route /api/auth/login.
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
  const isProd = process.env.NODE_ENV === "production";
  const baseFlags = `Path=/; SameSite=Lax; Max-Age=${maxAge}; HttpOnly` + (isProd ? "; Secure" : "");

  const res = NextResponse.json({ ok: true, userId });

  res.headers.append("Set-Cookie", `user_id=${encodeURIComponent(userId)}; ${baseFlags}`);
  if (email) {
    res.headers.append(
      "Set-Cookie",
      `user_email=${encodeURIComponent(email)}; ${baseFlags}`
    );
  }
  if (name) {
    res.headers.append(
      "Set-Cookie",
      `user_name=${encodeURIComponent(name)}; ${baseFlags}`
    );
  }

  return res;
}

/**
 * Supprime la session courante (logout).
 */
export async function deleteCurrentSession() {
  const isProd = process.env.NODE_ENV === "production";
  const baseFlags = `Path=/; Max-Age=0; SameSite=Lax; HttpOnly` + (isProd ? "; Secure" : "");
  const res = NextResponse.json({ ok: true });
  res.headers.append("Set-Cookie", `user_id=; ${baseFlags}`);
  res.headers.append("Set-Cookie", `user_email=; ${baseFlags}`);
  res.headers.append("Set-Cookie", `user_name=; ${baseFlags}`);
  return res;
}

/**
 * Vérification / hash du mot de passe avec bcrypt.
 * Utilisé par /api/auth/login et change-password.
 */
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

export async function hashPassword(plain: string): Promise<string> {
  // coût 12 : standard correct, tu pourras ajuster si besoin
  return bcrypt.hash(plain, 12);
}
