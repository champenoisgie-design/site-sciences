import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromDefault = process.env.MAIL_FROM || "Site Sciences <no-reply@example.com>";

let resend: Resend | null = null;
if (apiKey && apiKey.trim()) resend = new Resend(apiKey.trim());

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}) {
  const { to, subject, html, text, from } = opts;
  const payload = { from: from || fromDefault, to, subject, html, text };

  if (!resend) {
    // Fallback dev
    // eslint-disable-next-line no-console
    console.log("✉️ [DEV MAIL] →", JSON.stringify(payload, null, 2));
    return { id: "dev-mail", delivered: false };
  }

  const result = await resend.emails.send(payload as any);
  const id = (result as any)?.data?.id ?? null;
  const delivered = !((result as any)?.error);
  return { id, delivered };
}

/** Compat: certains fichiers importaient sendEmailConsole → alias vers sendMail */
export const sendEmailConsole = sendMail;
