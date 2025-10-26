// src/lib/privacy.ts
import crypto from "crypto";

const APP_SALT = process.env.APP_HASH_SALT || "site-sciences-default-salt";

export function hash(value: string): string {
  return crypto.createHash("sha256").update(APP_SALT + "::" + value).digest("hex");
}

export function deviceFingerprintCoarse(input: {
  userAgent?: string | null;
  language?: string | null;
  timezone?: string | null;
  ip?: string | null;
}) {
  const ua = (input.userAgent || "").trim().toLowerCase();
  const lang = (input.language || "").trim().toLowerCase();
  const tz = (input.timezone || "").trim().toLowerCase();
  const ip = (input.ip || "").trim().toLowerCase();
  return hash([ua, lang, tz, ip].join("|"));
}
