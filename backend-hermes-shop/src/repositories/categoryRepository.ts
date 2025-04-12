import type { Model } from '~/core/model/types';
import type { RepositoryFindOneWithName, RepositoryInsertOne } from '~/core/repository/types';

interface CategoryRepository<T extends Model> extends RepositoryFindOneWithName<T>, RepositoryInsertOne<T> {}

export type { CategoryRepository };
