import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedRoute = pathname.startsWith('/bookings') || pathname.startsWith('/book');
  const isAuthRoute = pathname.startsWith('/login');

  // Get session cookie (Better Auth uses 'better-auth.session_token')
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if ((isAdminRoute || isProtectedRoute) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
