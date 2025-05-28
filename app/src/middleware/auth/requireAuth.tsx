import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthPath = request.nextUrl.pathname.startsWith('/auth/');
  
  // If there's no token and the path isn't an auth path, redirect to login
  if (!authToken && !isAuthPath) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // If there is a token and the path is an auth path, redirect to dashboard
  // (prevents logged-in users from accessing login/signup pages)
  if (authToken && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    // Protected routes that require authentication
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/projects/:path*',
    // Auth routes (for redirection if already logged in)
    '/auth/:path*',
  ],
};