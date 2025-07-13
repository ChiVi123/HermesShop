import bcryptjs from 'bcryptjs';
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import env from '~/configs/environment';
import { StatusCodes } from '~/configs/statusCodes';
import NextError from '~/helpers/nextError';
import pickUser from '~/helpers/pickUser';
import type { UserReqBody } from '~/models/userModel';
import { jwtProvider } from '~/providers/jwtProvider';
import { UserModelRepository } from '~/repositories/implements/UserModelRepository';

const SALT_LENGTH = 8;
const EMAIL_SEPARATOR = '@';

export class AuthService {
  private userRepository: UserModelRepository;

  constructor() {
    this.userRepository = new UserModelRepository();
  }

  public refreshToken(token: string | undefined) {
    if (!token) throw new NextError(StatusCodes.FORBIDDEN, 'Please Sign In! (Error from refresh token)');

    try {
      const refreshTokenDecoded = jwtProvider.verifyToken(token, env.REFRESH_TOKEN_SECRET_SIGNATURE) as JwtPayload;
      const userInfo = { _id: refreshTokenDecoded._id, email: refreshTokenDecoded.email };
      const accessToken = jwtProvider.generateToken({
        payload: userInfo,
        secretSignature: env.ACCESS_TOKEN_SECRET_SIGNATURE,
        // tokenLife: env.ACCESS_TOKEN_LIFE,
        tokenLife: '30s',
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

    const nameSplit = email.split(EMAIL_SEPARATOR).shift();
    const userData = {
      email,
      displayName: nameSplit,
      username: nameSplit,
      password: bcryptjs.hashSync(password, SALT_LENGTH),
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
    const accessToken = jwtProvider.generateToken({
      payload: userInfo,
      secretSignature: env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // tokenLife: env.ACCESS_TOKEN_LIFE,
      tokenLife: '30s',
    });
    const refreshToken = jwtProvider.generateToken({
      payload: userInfo,
      secretSignature: env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // tokenLife: env.REFRESH_TOKEN_LIFE,
      tokenLife: '1m',
    });

    return { accessToken, refreshToken };
  }
}
