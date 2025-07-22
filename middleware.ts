import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('next-auth.session-token') || request.cookies.get('next-auth.session');
  const isLoggedIn = !!sessionToken;

  const publicPathsForLoggedOut = [
    '/',
    '/auth/login',
    '/auth/signup'
  ];

  const isCurrentlyPublicPathForLoggedOut = publicPathsForLoggedOut.some(path =>
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`)
  );

  if (!isLoggedIn && !isCurrentlyPublicPathForLoggedOut) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && (request.nextUrl.pathname.includes('/login') || request.nextUrl.pathname.includes('/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};