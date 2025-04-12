import type { WithId } from 'mongodb';
import type { Model } from '~/core/model/types';
import type { RepositoryInsertOne } from '~/core/repository/types';

interface UserRepository<T extends Model> extends RepositoryInsertOne<T> {
  findOneByEmail: (email: string) => Promise<WithId<T> | null>;
}

export type { UserRepository };
