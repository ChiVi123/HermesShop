import type { InsertManyResult, WithId } from 'mongodb';
import type { Model, ModelId } from '~/core/model/types';
import type { RepositoryFindOneWithName } from '~/core/repository/types';

interface SkuRepository<T extends Model> extends RepositoryFindOneWithName<T> {
  createMany(dataList: Record<string, unknown>[]): Promise<InsertManyResult<T>>;
  destroyById(skuId: ModelId): Promise<WithId<T> | null>;
}

export type { SkuRepository };
