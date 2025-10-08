// src/app/api/prof/enable/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { enableTeacherIfAllowlisted } from "@/lib/teacher";
import { sendMail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getSessionUser().catch(()=>null);
  if (!user) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status: 401 });

  const ok = await enableTeacherIfAllowlisted(user.id, user.email);
  if (ok) return NextResponse.json({ ok:true, enabled:true });

  const admin = process.env.ADMIN_EMAIL || "(console)";
  await sendMail({ to: admin, subject: "Demande accès prof", text: `Utilisateur: ${user.email ?? user.id}` }).catch(()=>{});
  return NextResponse.json({ ok:false, error:"not_allowlisted" }, { status: 403 });
}
