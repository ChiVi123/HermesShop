import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '~/configs/statusCodes';
import type NextError from '~/helpers/nextError';

type ResponseError = {
  statusCode: StatusCodes;
  message: string | 500 | 'INTERNAL_SERVER_ERROR';
  stack?: string | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandlingMiddleware = (err: NextError, _req: Request, res: Response, _next: NextFunction) => {
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  const responseError: ResponseError = {
    statusCode: err.statusCode,
    message: err?.message ?? StatusCodes[err.statusCode],
  };

  // set stack when app is dev mode
  // if ("check mode") responseError.stack = error.stack
  responseError.stack = err.stack;

  res.status(err.statusCode).json(responseError);
};

export default errorHandlingMiddleware;
