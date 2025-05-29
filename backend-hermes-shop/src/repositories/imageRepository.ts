import type { WithId } from 'mongodb';
import type { Model } from '~/core/model/types';
import type { RepositoryInsertOne } from '~/core/repository/types';

interface ImageRepository<T extends Model> extends RepositoryInsertOne<T> {
  findOneByPublicId: (publicId: string) => Promise<WithId<T> | null>;
}

export type { ImageRepository };
