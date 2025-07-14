import { NextResponse } from 'next/server';
import { TokenName } from '~/constants';

export async function GET() {
  const response = NextResponse.json({ message: 'logout successfully' });
  response.cookies.delete(TokenName.ACCESS_TOKEN);
  response.cookies.delete(TokenName.REFRESH_TOKEN);
  return response;
}
