import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genId } from "@/lib/id";
import { hashPin } from "@/lib/pin";
import { computeTrialDates } from "@/lib/trialDates";
import { createSessionForUser, hashPassword } from "@/lib/auth";
import crypto from "crypto";

/**
 * Nouveau Signup (Parents) — vérité serveur
 * Input attendu:
 * - emailParent
 * - prenomParent
 * - grade
 * - subject
 * - pin + pinConfirm
 * - acceptTerms + acceptPrivacy
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const emailParent = String(body?.emailParent ?? "").trim().toLowerCase();
    const prenomEnfant = String(body?.prenomEnfant ?? body?.prenomParent ?? "").trim();
    const grade = String(body?.grade ?? "").trim();
    const subject = String(body?.subject ?? "").trim();

    const pin = String(body?.pin ?? "").trim();
    const pinConfirm = String(body?.pinConfirm ?? "").trim();
    const password = String(body?.password ?? "");
    const passwordConfirm = String(body?.passwordConfirm ?? "");

    if (process.env.NODE_ENV !== "production") {
      console.log("[signup] recv", { emailParent, passwordLen: String(password).length, passwordConfirmLen: String(passwordConfirm).length });
    }

    const acceptTerms = Boolean(body?.acceptTerms);
    const acceptPrivacy = Boolean(body?.acceptPrivacy);

    // --- validations strictes ---
    const ALLOWED_GRADES = new Set(['6e','5e','4e','3e','2nde','1re','Terminale']);
    if (!ALLOWED_GRADES.has(grade)) {
      return NextResponse.json({ ok: false, error: 'GRADE_INVALID' }, { status: 400 });
    }
    if (!emailParent || !prenomEnfant || !grade || !subject) {
      return NextResponse.json({ ok: false, error: "MISSING_FIELDS" }, { status: 400 });
    }
    if (!acceptTerms || !acceptPrivacy) {
      return NextResponse.json({ ok: false, error: "CONSENT_REQUIRED" }, { status: 400 });
    }
    if (!pin || !pinConfirm || pin !== pinConfirm) {

    if (!password || !passwordConfirm || password !== passwordConfirm) {
      return NextResponse.json({ ok: false, error: "PASSWORD_MISMATCH" }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ ok: false, error: "WEAK_PASSWORD" }, { status: 400 });
    }
      return NextResponse.json({ ok: false, error: "PIN_MISMATCH" }, { status: 400 });
    }

    // Hash PIN (format 4 chiffres enforced dans hashPin)
    let parentPinHash: string;
    try {
      parentPinHash = await hashPin(pin);
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, error: "PIN_INVALID", message: e?.message ?? "PIN_INVALID" },
        { status: 400 }
      );
    }

    // Email unique
    const exists = await prisma.user.findUnique({ where: { email: emailParent } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "EMAIL_IN_USE" }, { status: 409 });
    }

    // Mot de passe
    const passwordHash = await hashPassword(password);

    // Trial: 3 jours, 1 niveau + 1 matière
    const now = new Date();
    const { start, end } = computeTrialDates(now);

    const user = await prisma.user.create({
      data: {
        id: genId(),
        createdAt: now,
        updatedAt: now,
        email: emailParent,
        name: prenomEnfant,
        passwordHash,

        parentPinHash,
        parentPinSetAt: now,
        parentPinFailed: 0,
        parentPinLockedUntil: null,

        trialStartAt: start,
        trialEndsAt: end,
        trialGrade: grade,
        trialSubject: subject,
      } as any,
    });

    // Crée réponse session (cookies user_id/user_email/user_name)
    const res = await createSessionForUser(user.id, {
      email: user.email,
      name: user.name ?? null,
      remember: true,
    });

    // IMPORTANT: cookie "session" pour ParentPinSession (sessionId stable)
    const sessionId = crypto.randomUUID();
    const isProd = process.env.NODE_ENV === "production";
    const maxAge = 60 * 60 * 24 * 7; // 7j (cohérent avec createSessionForUser quand remember=false/true -> ici true mais ok)
    const baseFlags =
      `Path=/; SameSite=Lax; Max-Age=${maxAge}; HttpOnly` + (isProd ? "; Secure" : "");

    res.headers.append("Set-Cookie", `session=${encodeURIComponent(sessionId)}; ${baseFlags}`);

    return res;
  } catch (e: any) {
    const message = e?.message ?? "UNKNOWN_ERROR";
    const stack = process.env.NODE_ENV === "development" ? (e?.stack ?? null) : null;
    return NextResponse.json({ ok: false, error: "INTERNAL_ERROR", message, stack }, { status: 500 });
  }
}
