import type { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    jwtDecode?: JwtPayload;
  }
}
