import { NextResponse } from 'next/server'

const COOKIE_NAME = 'learning_mode'
const cookieOpts = {
  httpOnly: false, // côté client OK
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 365, // 1 an
}

export async function POST(req: Request) {
  let payload: any = {}
  try { payload = await req.json() } catch {}
  const value = typeof payload?.value === 'string' ? payload.value : null
  if (!value) {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, value, cookieOpts)
  return res
}

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') ?? ''
  const m = cookieHeader.match(/(?:^|;\s*)learning_mode=([^;]+)/)
  const value = m ? decodeURIComponent(m[1]) : null
  return NextResponse.json({ value })
}
