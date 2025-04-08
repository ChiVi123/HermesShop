import Jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

type GenerateToken = {
  payload: Record<string, unknown>;
  secretSignature: string;
  tokenLife: StringValue | number;
};

const generateToken = (params: GenerateToken): string => {
  return Jwt.sign(params.payload, params.secretSignature, { algorithm: 'HS256', expiresIn: params.tokenLife });
};
const verifyToken = (token: string, secretSignature: string) => Jwt.verify(token, secretSignature);

const JwtProvider = { generateToken, verifyToken };
export default JwtProvider;
