import nodemailer from 'nodemailer'

function hasSmtpEnv() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS)
}

export async function sendMail(opts: { to: string; subject: string; text?: string; html?: string }) {
  if (!hasSmtpEnv()) {
    console.log('[MAIL:FALLBACK]', { to: opts.to, subject: opts.subject, text: opts.text, html: opts.html })
    return { ok: true, transport: 'console' }
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  })
  const from = process.env.SMTP_FROM || 'no-reply@example.com'
  await transporter.sendMail({ from, ...opts })
  return { ok: true, transport: 'smtp' }
}
