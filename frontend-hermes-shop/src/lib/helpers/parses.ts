import { parseInt } from 'lodash';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

type ParseCookies = Record<string, string | number | boolean | Date>;

const RESPONSE_COOKIE_PROPERTIES: Record<string, string> = Object.freeze({
  'Max-Age': 'maxAge',
  Path: 'path',
  Expires: 'expires',
  HttpOnly: 'httpOnly',
  Secure: 'secure',
  SameSite: 'sameSite',
});

export function parseCookies(value: string): Partial<ResponseCookie> {
  const result: ParseCookies = {};

  value.split(';').forEach((cookie) => {
    const [key, ...value] = cookie.trim().split('=');
    const newKey = RESPONSE_COOKIE_PROPERTIES[key];
    const decodeValue = decodeURIComponent(value.join('='));

    if (newKey) {
      switch (newKey) {
        case 'maxAge':
          result[newKey] = parseInt(decodeValue);
          break;
        case 'expires':
          result[newKey] = new Date(decodeValue);
          break;

        default:
          result[newKey] = decodeValue || true;
          break;
      }
    } else {
      result.name = key;
      result.value = decodeValue;
    }
  });

  return result;
}
