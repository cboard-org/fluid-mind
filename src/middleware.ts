import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const isLoginPage = req.nextUrl.pathname === '/login';
  const isSignupPage = req.nextUrl.pathname === '/signup';

  if ((isLoginPage || isSignupPage) && isAuthenticated) {
    console.log('Authenticated user attempting to access login page. Redirecting...');
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isAuthenticated && !(isLoginPage || isSignupPage)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
