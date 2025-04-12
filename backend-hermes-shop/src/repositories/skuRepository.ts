import type { InsertManyResult, InsertOneResult, WithId } from 'mongodb';
import type { ModelId } from '~/models/model';

interface SkuRepository<T> {
  create(data: Record<string, unknown>): Promise<InsertOneResult<T>>;
  createMany(dataList: Record<string, unknown>[]): Promise<InsertManyResult<T>>;
  update(skuId: ModelId, updateData: Record<string, unknown>): Promise<WithId<T> | null>;
  findOneBySlugify(slugify: string): Promise<WithId<T> | null>;
  destroyById(skuId: ModelId): Promise<WithId<T> | null>;
}

export type { SkuRepository };
