import type { WithId } from 'mongodb';
import type { STATUS_PRODUCT_KEYS } from '~/configs/statusProductKeys';
import type { Model, ModelId, ModelIds, ModelResponse } from '~/core/model/types';
import type { Image } from '~/models/imageModel';

export interface ProductModel extends Model {
  name: string;
  slugify: string;
  shortDescription: string;
  rating: number;
  gender: string;
  attrs: ProductAttr[];
  skuIds: ModelIds;
  _status: STATUS_PRODUCT_KEYS;
}
export interface SkuModel extends Model {
  productId: ModelId;
  name: string;
  slugify: string;
  price: number;
  discountPrice: number;
  images: Image[];
  attrs: SkuAttr[];
}
export interface ProductAttr {
  key: string;
  type: string;
}
export interface SkuAttr {
  key: string;
  value: string;
  unit?: string;
}

export type ProductResponse = ModelResponse;
export type ProductReqBody = {
  name: string;
  shortDescription: string;
  attrs: { key: string; type: string }[];
  skus: { name: string; price: number; discountPrice: number; attrs: { key: string; value: string }[] }[];
};

export type ProductModelProperties = keyof WithId<ProductModel>;
export type SkuModelProperties = keyof WithId<SkuModel>;
