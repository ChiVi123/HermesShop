import type { Request, Response } from 'express';
import { StatusCodes } from '~/configs/statusCode';

const routeNotFoundMiddleware = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    statusCode: StatusCodes.NOT_FOUND,
    message: 'Route Not Found',
  });
};

export default routeNotFoundMiddleware;
