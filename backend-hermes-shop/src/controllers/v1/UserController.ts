import type { Request, Response } from 'express';
import { StatusCodes } from '~/configs/statusCodes';
import Controller from '~/controllers/Controller';
import controllerDecorator from '~/decorators/controllerDecorator';
import routeDecorator from '~/decorators/routeDecorator';
import type { UserService } from '~/services/userService';
import { userService } from '~/services/userService';

@controllerDecorator('/v1/users')
class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = userService;
  }

  @routeDecorator('get', '/info')
  async refreshToken(req: Request, res: Response) {
    const email = req.jwtDecode?.email;
    const result = await this.userService.getInfo(email);
    res.status(StatusCodes.OK).json(result);
  }
}

export default UserController;
