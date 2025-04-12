import type { InsertOneResult, WithId } from 'mongodb';
import type { ModelId } from '~/models/model';

interface categoryRepository<T> {
  findOneById(categoryId: ModelId): Promise<WithId<T> | null>;
  findOneByName(name: string): Promise<WithId<T> | null>;
  findOneBySlugify(slugify: string): Promise<WithId<T> | null>;
  create(data: Record<string, unknown>): Promise<InsertOneResult<T>>;
  update(categoryId: ModelId, updateData: Record<string, unknown>): Promise<WithId<T> | null>;
}

export type { categoryRepository };
