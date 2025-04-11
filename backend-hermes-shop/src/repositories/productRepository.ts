import type { Document, InsertOneResult, ObjectId, WithId } from 'mongodb';
import type { ModelId } from '~/models/model';

interface ProductRepository<T> {
  create(data: Record<string, unknown>): Promise<InsertOneResult<T>>;
  update(id: string, updateData: Record<string, unknown>): Promise<WithId<T> | null>;
  pushSkuIds(id: string | ObjectId, skuIds: (string | ObjectId)[]): Promise<WithId<T> | null>;
  pullSkuIds(id: string | ObjectId, skuIds: (string | ObjectId)[]): Promise<WithId<T> | null>;
  findOneById(id: string | ObjectId): Promise<WithId<T> | null>;
  findOneByName(name: string): Promise<WithId<T> | null>;
  getDetailsBySlugify(slugify: string): Promise<Document | null>;
  destroyById(id: ModelId): Promise<WithId<T> | null>;
}

export type { ProductRepository };
