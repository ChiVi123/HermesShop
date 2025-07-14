import ms from 'ms';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const FALLBACK_IMAGE_URL = '/images/fallback.png';

export enum TokenName {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken',
}
export enum RoutePage {
  HOME = '/',
  LOGIN = '/login',
  PROFILE = '/profile',
  LOGOUT = '/logout',
}
export const cookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: ms((process.env.NEXT_PUBLIC_COOKIE_MAX_AGE as ms.StringValue) ?? '14 days'),
};
