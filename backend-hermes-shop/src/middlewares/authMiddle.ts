import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import env from '~/configs/environment';
import { StatusCodes } from '~/configs/statusCode';
import NextError from '~/helpers/nextError';
import JwtProvider from '~/providers/jwt';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const clientAccessToken = req.cookies?.accessToken;

  if (!clientAccessToken) return next(new NextError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Token not found)'));

  try {
    const accessTokenDecoded = JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE);
    req.jwtDecode = accessTokenDecoded as JwtPayload;
    next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('jwt expired')) {
      next(new NextError(StatusCodes.GONE, 'Need to refresh token'));
    } else {
      next(new NextError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'));
    }
  }
};
export default authMiddleware;
