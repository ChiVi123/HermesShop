import type { Document, InsertOneResult, WithId } from 'mongodb';
import type { ModelId } from '~/models/model';

interface ProductRepository<T> {
  create(data: Record<string, unknown>): Promise<InsertOneResult<T>>;
  update(productId: string, updateData: Record<string, unknown>): Promise<WithId<T> | null>;
  pushSkuIds(productId: ModelId, skuIds: ModelId[]): Promise<WithId<T> | null>;
  pullSkuIds(productId: ModelId, skuIds: ModelId[]): Promise<WithId<T> | null>;
  findOneByName(name: string): Promise<WithId<T> | null>;
  getDetailsBySlugify(slugify: string): Promise<Document | null>;
  destroyById(productId: ModelId): Promise<WithId<T> | null>;
}

export type { ProductRepository };
