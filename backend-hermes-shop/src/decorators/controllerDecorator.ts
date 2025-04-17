import { METADATA_KEYS } from '~/configs/keys';

function controllerDecorator(baseRoute: string = ''): ClassDecorator {
  return (target) => Reflect.defineMetadata(METADATA_KEYS.BASE_ROUTE, baseRoute, target);
}
export default controllerDecorator;
