import type { WithId } from 'mongodb';
import type { Model } from '~/core/model/types';

export interface CategoryModel extends Model {
  name: string;
  slugify: string;
}
export type CategoryReqBody = {
  name: string;
};
export type CategoryModelProperties = keyof WithId<CategoryModel>;
