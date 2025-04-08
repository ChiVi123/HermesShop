import type { StatusCodes } from '~/configs/statusCode';

class NextError extends Error {
  public statusCode: StatusCodes;

  constructor(statusCode: StatusCodes, err: unknown) {
    if (typeof err === 'string') {
      super(err);
    } else if (err instanceof Error) {
      super(err.message);
    } else {
      super();
    }

    this.name = 'ResError';
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default NextError;
