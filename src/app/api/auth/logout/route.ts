import { deleteCurrentSession } from '@/lib/auth'

export async function POST() {
  // deleteCurrentSession returns a NextResponse with cleared cookies
  const res = await deleteCurrentSession()

  // Also clear the "session" cookie used by ParentPinSession (and any stale values)
  const isProd = process.env.NODE_ENV === 'production'
  const baseFlags = `Path=/; Max-Age=0; SameSite=Lax; HttpOnly` + (isProd ? '; Secure' : '')
  res.headers.append('Set-Cookie', `session=; ${baseFlags}`)

  return res
}
