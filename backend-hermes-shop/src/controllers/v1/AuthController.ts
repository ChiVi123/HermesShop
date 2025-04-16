import type { CookieOptions, Request, Response } from 'express';
import ms from 'ms';
import env from '~/configs/environment';
import { StatusCodes } from '~/configs/statusCodes';
import Controller from '~/controllers/Controller';
import controllerDecorator from '~/decorators/controllerDecorator';
import routeDecorator from '~/decorators/routeDecorator';
import validateDecorator from '~/decorators/validateDecorator';
import { AuthService } from '~/services/AuthService';
import { registerOrLoginSchema } from '~/validates/authValidate';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: ms(env.SERVER_COOKIE_MAX_AGE),
};

@controllerDecorator('/v1/auth')
class AuthController extends Controller {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  @routeDecorator('get', '/refresh-token')
  async refreshToken(req: Request, res: Response) {
    const result = this.authService.refreshToken(req.cookies?.refreshToken);

    res.cookie('accessToken', result.accessToken, cookieOptions);
    res.status(StatusCodes.OK).json({ message: 'refreshToken' });
  }

  @routeDecorator('post', '/register')
  @validateDecorator(registerOrLoginSchema)
  async register(req: Request, res: Response) {
    const userCreated = await this.authService.register(req.body);
    res.status(StatusCodes.CREATED).json(userCreated);
  }

  @routeDecorator('post', '/login')
  @validateDecorator(registerOrLoginSchema)
  async login(req: Request, res: Response) {
    const result = await this.authService.login(req.body);

    res.cookie('accessToken', result.accessToken, cookieOptions);
    res.cookie('refreshToken', result.refreshToken, cookieOptions);
    res.status(StatusCodes.OK).json(result);
  }

  @routeDecorator('delete', '/logout')
  async logout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(StatusCodes.OK).json({ loggedOut: true });
  }
}

export default AuthController;
