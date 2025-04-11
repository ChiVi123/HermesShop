import type { InsertOneResult, WithId } from 'mongodb';
import type { ModelId } from '~/models/model';

interface SkuRepository<T> {
  create(data: Record<string, unknown>): Promise<InsertOneResult<T>>;
  update(id: ModelId, updateData: Record<string, unknown>): Promise<WithId<T> | null>;
  findOneById(id: ModelId): Promise<WithId<T> | null>;
  findOneBySlugify(slugify: string): Promise<WithId<T> | null>;
  destroyById(id: ModelId): Promise<WithId<T> | null>;
}

export type { SkuRepository };
