import type { InsertOneResult, ObjectId, WithId } from 'mongodb';

interface SkuRepository<T> {
  create(data: Record<string, unknown>): Promise<InsertOneResult<T>>;
  update(id: string, updateData: Record<string, unknown>): Promise<WithId<T> | null>;
  findOneById(id: string | ObjectId): Promise<WithId<T> | null>;
  findOneBySlugify(slugify: string): Promise<WithId<T> | null>;
}

export type { SkuRepository };
