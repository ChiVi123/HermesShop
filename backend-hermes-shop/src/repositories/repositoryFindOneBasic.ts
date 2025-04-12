import type { WithId } from 'mongodb';
import type { ModelId } from '~/models/model';

export interface RepositoryFindOneBasic<T> {
  findOneById(id: ModelId): Promise<WithId<T> | null>;
}
