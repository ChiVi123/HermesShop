import type { NextFunction, Request, Response } from 'express';
import type Joi from 'joi';
import { StatusCodes } from '~/configs/statusCode';
import NextError from '~/helpers/nextError';

function validateDecorator(schema: Joi.ObjectSchema): MethodDecorator {
  return (_target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalHandler = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        await schema.validateAsync(req.body, { abortEarly: false });
      } catch (error) {
        return next(new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error));
      }
      originalHandler.call(this, req, res, next).catch((error: unknown) => {
        logging(`[${propertyKey.toString()}] error`, error);
        next(error);
      });
    };
  };
}

export default validateDecorator;
