import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware — protects all /products routes.
 * Reads the HttpOnly `token` cookie set by /api/auth/login.
 * If no token is present, redirects to /login.
 * This runs on the server (edge runtime) so there is no client-side bypass.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the originally requested URL so we can redirect back after login
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path*'],
};
