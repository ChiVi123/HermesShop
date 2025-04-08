import type { Request, Response } from 'express';
import { StatusCodes } from '~/configs/statusCode';
import Controller from '~/controllers/Controller';
import controllerDecorator from '~/decorators/controllerDecorator';
import routeDecorator from '~/decorators/routeDecorator';

@controllerDecorator('/v1/test')
class TestController extends Controller {
  @routeDecorator('get', '/health-check')
  getHealthCheck(_req: Request, res: Response) {
    res.status(StatusCodes.OK).json({ message: 'response successfully' });
  }

  @routeDecorator('get', '/throw-error')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getThrowError(_req: Request, _res: Response) {
    throw new Error('message error response');
  }
}

export default TestController;
