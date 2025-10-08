import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "");
  const message = String(form.get("message") || "");
  if (!email || !message) {
    return NextResponse.json({ ok: false, error: "Champs manquants" }, { status: 400 });
  }

  await sendMail({
    to: "support@exemple.com",
    subject: "Nouveau message de contact",
    text: `De: ${email}\n\n${message}`,
    html: `<p><b>De:</b> ${email}</p><pre>${message}</pre>`,
  });

  return NextResponse.redirect("/contact", { status: 302 });
}
