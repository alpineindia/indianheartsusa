import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const publicRoutes = ['/', '/login', '/register', '/success-stories', '/membership']
const adminRoutes = ['/admin']
const memberRoutes = ['/browse', '/profile', '/search', '/dashboard']
const approvalPendingRoutes = ['/pending-approval', '/suspended', '/rejected']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('session')?.value
  const session = await decrypt(sessionCookie)

  const isPublic = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'))
  const isAdmin = adminRoutes.some((r) => pathname.startsWith(r))
  const isMember = memberRoutes.some((r) => pathname.startsWith(r))
  const isApprovalPage = approvalPendingRoutes.some((r) => pathname.startsWith(r))

  if (!session && (isAdmin || isMember)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && (pathname === '/login' || pathname === '/register')) {
    if (session.status === 'APPROVED') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (session && isAdmin && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (session && isMember && session.status !== 'APPROVED') {
    if (session.status === 'PENDING') return NextResponse.redirect(new URL('/pending-approval', request.url))
    if (session.status === 'SUSPENDED') return NextResponse.redirect(new URL('/suspended', request.url))
    if (session.status === 'REJECTED') return NextResponse.redirect(new URL('/rejected', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
