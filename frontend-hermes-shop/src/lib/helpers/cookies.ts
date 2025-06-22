import { cookies } from 'next/headers';

export async function getCookiesString() {
  return (await cookies()).toString();
}
