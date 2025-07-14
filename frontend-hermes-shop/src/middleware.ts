import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { TokenName } from '~/constants';

// 1. Specify protected and public routes
const protectedRoutes = ['/profile'];
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Get the access token from the cookies
  const accessToken = request.cookies.get(TokenName.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(TokenName.REFRESH_TOKEN)?.value;

  // 3. Redirect to profile if the user is authenticated and tries to access a public route
  if (publicRoutes.includes(pathname) && accessToken && refreshToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // 4. Redirect to login if the user is not authenticated and tries to access a protected route
  if (protectedRoutes.includes(pathname) && (!accessToken || !refreshToken)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/login', '/profile'],
};
