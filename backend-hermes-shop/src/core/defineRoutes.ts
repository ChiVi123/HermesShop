import type { Express } from 'express';
import { securityPathMap } from '~/configs/cors';
import { METADATA_KEYS } from '~/configs/keys';
import type Controller from '~/controllers/Controller';
import authMiddleware from '~/middlewares/authMiddleware';
import type { MapperExpressMethods } from '~/types/expressProperties';

function defineRoutes(controllers: (typeof Controller)[], application: Express) {
  for (const Controller of controllers) {
    const controller = new Controller();
    const mapperMethods: MapperExpressMethods = Reflect.getMetadata(METADATA_KEYS.ROUTE_HANDLERS, controller);
    const baseRoute: string = Reflect.getMetadata(METADATA_KEYS.BASE_ROUTE, Controller);

    for (const [method, mapperRoutes] of mapperMethods) {
      for (const [route, handlers] of mapperRoutes) {
        const completePath = baseRoute + route;
        // function handler need context of classes inherit from class Controller
        // like properties or methods
        let completeHandlers = handlers.map((fn) => fn.bind(controller));

        if (securityPathMap.has(method)) {
          const paths = securityPathMap.get(method) ?? [];
          paths.forEach((regex) => {
            if (regex.test(completePath)) completeHandlers = [authMiddleware, ...completeHandlers];
          });
        }

        application[method](completePath, completeHandlers);
      }
    }
  }
}

export default defineRoutes;
