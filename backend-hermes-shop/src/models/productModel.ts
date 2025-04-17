import type { WithId } from 'mongodb';
import type { OPTION_TYPE_KEYS, STATUS_PRODUCT_KEYS } from '~/configs/keys';
import type { Model, ModelId, ModelIds, ModelResponse } from '~/core/model/types';
import type { Image } from '~/models/imageModel';

export interface ProductModel extends Model {
  name: string;
  slugify: string;
  shortDescription: string;
  rating: number;
  gender: string;
  attrs: ProductAttr[];
  options: ProductOption[];
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
  specs: SkuSpec[];
}
export interface ProductOption {
  key: string;
  type: OPTION_TYPE_KEYS;
}
export interface ProductAttr {
  key: string;
  value: string;
}
export interface SkuSpec {
  key: string;
  value: string;
  unit?: string;
}

export type ProductResponse = ModelResponse;
export type ProductReqBody = {
  name: string;
  shortDescription: string;
  attrs: ProductAttr[];
  options: ProductOption[];
  skus: { name: string; price: number; discountPrice: number; specs: { key: string; value: string }[] }[];
};

export type ProductModelProperties = keyof WithId<ProductModel>;
export type SkuModelProperties = keyof WithId<SkuModel>;
