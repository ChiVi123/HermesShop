import { NextRequest, NextResponse } from 'next/server';
import { cookieOptions, TokenName } from '~/constants';
import { FetchClientError } from '~/lib/fetchClient/FetchClientError';
import { StatusCodes } from '~/lib/fetchClient/StatusCodes';
import { refreshTokenFromNextServerToServer } from '~/services/auth';

export async function POST(req: NextRequest) {
  const cookies = req.cookies.toString();

  try {
    const res = await refreshTokenFromNextServerToServer(cookies);
    const response = NextResponse.json({ message: 'refresh successfully' });
    response.cookies.set(TokenName.ACCESS_TOKEN, res.accessToken, cookieOptions);
    return response;
  } catch (error) {
    if (error instanceof FetchClientError) {
      return NextResponse.json(error, { status: error.status });
    } else {
      return NextResponse.json(
        { error: { message: 'INTERNAL_SERVER_ERROR' } },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }
  }
}
