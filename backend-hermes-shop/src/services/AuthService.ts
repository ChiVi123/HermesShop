import bcryptjs from 'bcryptjs';
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import env from '~/configs/environment';
import { StatusCodes } from '~/configs/statusCode';
import NextError from '~/helpers/nextError';
import pickUser from '~/helpers/pickUser';
import type { UserReqBody } from '~/models/userModel';
import JwtProvider from '~/providers/jwt';
import { UserModelRepository } from '~/repositories/implements/UserModelRepository';

export class AuthService {
  private userRepository: UserModelRepository;

  constructor() {
    this.userRepository = new UserModelRepository();
  }

  public refreshToken(token: string | undefined) {
    if (!token) throw new NextError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh token)');

    try {
      const refreshTokenDecoded = JwtProvider.verifyToken(token, env.REFRESH_TOKEN_SECRET_SIGNATURE) as JwtPayload;
      const userInfo = { _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email };
      const accessToken = JwtProvider.generateToken({
        payload: userInfo,
        secretSignature: env.ACCESS_TOKEN_SECRET_SIGNATURE,
        // tokenLife: env.ACCESS_TOKEN_LIFE,
        tokenLife: '5s',
      });
      return { accessToken };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NextError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh token)');
    }
  }

  public async register(reqBody: Request<unknown, unknown, UserReqBody>['body']) {
    const { email, password } = reqBody;
    const existUser = await this.userRepository.findOneByEmail(email);
    if (existUser) throw new NextError(StatusCodes.CONFLICT, 'Email already exists!');

    const userData = {
      email,
      displayName: email.split('@')[0],
      username: email.split('@')[0],
      password: bcryptjs.hashSync(password, 8),
    };
    const insertedOneResult = await this.userRepository.insertOne(userData);
    const userCreated = (await this.userRepository.findOneById(insertedOneResult.insertedId))!;

    return pickUser(userCreated);
  }

  public async login(reqBody: Request<unknown, unknown, UserReqBody>['body']) {
    const { email, password } = reqBody;
    const existUser = await this.userRepository.findOneByEmail(email);

    if (!existUser) throw new NextError(StatusCodes.CONFLICT, 'Account not found!');
    if (!bcryptjs.compareSync(password, existUser.password)) {
      throw new NextError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect!');
    }

    const userInfo = { _id: existUser._id, email: existUser.email };
    const accessToken = JwtProvider.generateToken({
      payload: userInfo,
      secretSignature: env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // tokenLife: env.ACCESS_TOKEN_LIFE,
      tokenLife: '5s',
    });
    const refreshToken = JwtProvider.generateToken({
      payload: userInfo,
      secretSignature: env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // tokenLife: env.REFRESH_TOKEN_LIFE,
      tokenLife: '15s',
    });

    return { accessToken, refreshToken, ...pickUser(existUser) };
  }
}
