import { NextResponse, type NextRequest } from 'next/server'

// /tarifs/mode-d-apprentissage&mode=dys  → /tarifs/mode-d-apprentissage/dys
// /tarifs/mode-d-apprentissage?tab=hpi   → /tarifs/mode-d-apprentissage/hpi
export function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.pathname

  if (pathname.startsWith('/tarifs/mode-d-apprentissage')) {
    const qm = url.searchParams.get('mode')
    if (qm) {
      url.searchParams.delete('mode')
      url.pathname = `/tarifs/mode-d-apprentissage/${qm.toLowerCase()}`
      return NextResponse.redirect(url, 308)
    }
    const tab = url.searchParams.get('tab')
    if (tab) {
      url.searchParams.delete('tab')
      url.pathname = `/tarifs/mode-d-apprentissage/${tab.toLowerCase()}`
      return NextResponse.redirect(url, 308)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/tarifs/mode-d-apprentissage/:path*'],
}
