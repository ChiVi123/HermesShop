import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { METADATA_KEYS } from '~/configs/keys';
import type { MapperExpressMethods } from '~/types/expressProperties';

function routeDecorator(method: keyof Express, path: string = '', ...handlers: RequestHandler[]): MethodDecorator {
  return (target, _propertyKey, descriptor: PropertyDescriptor) => {
    const mapperMethods: MapperExpressMethods = Reflect.getMetadata(METADATA_KEYS.ROUTE_HANDLERS, target) ?? new Map();

    if (!mapperMethods.has(method)) mapperMethods.set(method, new Map());

    const mapperRoutes = mapperMethods.get(method)!;
    const originalHandler = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        await originalHandler.call(this, req, res, next);
      } catch (error) {
        next(error);
      }
    };
    mapperRoutes.set(path, [...handlers, descriptor.value]);

    Reflect.defineMetadata(METADATA_KEYS.ROUTE_HANDLERS, mapperMethods, target);
  };
}

export default routeDecorator;
