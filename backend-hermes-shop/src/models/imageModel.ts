import type { WithId } from 'mongodb';
import type { Model } from '~/core/model/types';

export interface ImageModel extends Model {
  publicId: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
}
export type ImageModelProperties = keyof WithId<ImageModel>;
