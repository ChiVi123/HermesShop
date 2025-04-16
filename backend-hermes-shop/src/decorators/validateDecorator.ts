import type { NextFunction, Request, Response } from 'express';
import type Joi from 'joi';
import { StatusCodes } from '~/configs/statusCodes';
import NextError from '~/helpers/nextError';

function validateDecorator(schema: Joi.ObjectSchema): MethodDecorator {
  return (_target, _propertyKey, descriptor: PropertyDescriptor) => {
    const originalHandler = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        await schema.validateAsync(req.body, { abortEarly: false });
      } catch (error) {
        return next(new NextError(StatusCodes.UNPROCESSABLE_ENTITY, error));
      }
      originalHandler.call(this, req, res, next).catch((error: unknown) => {
        next(error);
      });
    };
  };
}

export default validateDecorator;
