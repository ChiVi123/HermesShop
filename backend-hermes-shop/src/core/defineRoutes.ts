import type { Express } from 'express';
import { securityPathConfig } from '~/configs/cors';
import { METADATA_KEYS } from '~/configs/metadataKeys';
import type Controller from '~/controllers/Controller';
import authMiddleware from '~/middlewares/authMiddle';
import type { MapperExpressMethods } from '~/types/expressProperties';

function defineRoutes(controllers: (typeof Controller)[], application: Express) {
  for (const Controller of controllers) {
    const controller = new Controller();
    const mapperMethods: MapperExpressMethods = Reflect.getMetadata(METADATA_KEYS.ROUTE_HANDLERS, controller);
    const baseRoute: string = Reflect.getMetadata(METADATA_KEYS.BASE_ROUTE, Controller);

    for (const [method, mapperRoutes] of mapperMethods) {
      for (const [route, handlers] of mapperRoutes) {
        const completePath = baseRoute + route;
        let completeHandlers = handlers;

        securityPathConfig.forEach((regexPath) => {
          if (regexPath.test(completePath)) completeHandlers = [authMiddleware, ...completeHandlers];
        });
        application[method](completePath, completeHandlers);
      }
    }
  }
}

export default defineRoutes;
