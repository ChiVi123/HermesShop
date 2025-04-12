import type { WithId } from 'mongodb';
import type { Model, ModelId } from '~/core/model/types';
import type { RepositoryFindOneWithName, RepositoryInsertOne } from '~/core/repository/types';

interface ProductRepository<T extends Model> extends RepositoryFindOneWithName<T>, RepositoryInsertOne<T> {
  pushSkuIds(productId: ModelId, skuIds: ModelId[]): Promise<WithId<T> | null>;
  pullSkuIds(productId: ModelId, skuIds: ModelId[]): Promise<WithId<T> | null>;
  destroyById(productId: ModelId): Promise<WithId<T> | null>;
}

export type { ProductRepository };
