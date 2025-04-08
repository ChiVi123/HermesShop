import { METADATA_KEYS } from '~/configs/metadataKeys';

function controllerDecorator(baseRoute: string = ''): ClassDecorator {
  return (target) => Reflect.defineMetadata(METADATA_KEYS.BASE_ROUTE, baseRoute, target);
}
export default controllerDecorator;
