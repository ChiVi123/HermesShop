import type { InsertOneResult, WithId } from 'mongodb';
import type { Model } from '~/core/model/types';

export interface RepositoryFindOneWithName<T extends Model> {
  findOneByName(name: string): Promise<WithId<T> | null>;
  findOneBySlugify(slugify: string): Promise<WithId<T> | null>;
}
export interface RepositoryInsertOne<T extends Model> {
  insertOne(data: Record<string, unknown>): Promise<InsertOneResult<T>>;
}
