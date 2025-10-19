import crypto from "crypto";
import { prisma } from "./prisma";
import { sendMail } from "./mailer";
import { otpTemplate } from "@/emails/otp";

/** Génère un code 6 chiffres. */
export function genOtpCode(): string {
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

/** Hash du code + deviceHash. */
function hashOtp(code: string, deviceHash: string) {
  return crypto.createHash("sha256").update(`${code}|${deviceHash}`).digest("hex");
}

export async function issueOtp(params: {
  userId: string;
  deviceHash: string;
  email: string;
  ttlSeconds?: number; // défaut 10min
}) {
  const { userId, deviceHash, email, ttlSeconds = 600 } = params;
  const code = genOtpCode();
  const codeHash = hashOtp(code, deviceHash);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  // ⚠️ Schéma exige 'email'
  await prisma.loginOtp.create({
    data: { userId, deviceHash, email, codeHash, expiresAt },
  });

  const t = otpTemplate(code);
  await sendMail({ to: email, subject: t.subject, html: t.html, text: t.text });

  return { expiresAt };
}

export async function verifyOtp(params: {
  userId: string;
  deviceHash: string;
  code: string;
}) {
  const { userId, deviceHash, code } = params;
  const codeHash = hashOtp(code, deviceHash);
  const now = new Date();

  const rec = await prisma.loginOtp.findFirst({
    where: { userId, deviceHash, codeHash, consumedAt: null, expiresAt: { gt: now } },
    orderBy: { createdAt: "desc" },
  });

  if (!rec) return false;

  await prisma.loginOtp.update({
    where: { id: rec.id },
    data: { consumedAt: new Date() },
  });

  return true;
}
