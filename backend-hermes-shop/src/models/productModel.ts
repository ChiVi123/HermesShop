import type { WithId } from 'mongodb';
import type { OPTION_TYPE_KEYS, STATUS_PRODUCT_KEYS } from '~/configs/keys';
import type { Model, ModelId, ModelIds, ModelResponse } from '~/core/model/types';

export interface ProductModel extends Model {
  name: string;
  slugify: string;
  shortDescription: string;
  categoryId: ModelId;
  rating: number;
  gender: string;
  attrs: ProductAttr[];
  options: ProductOption[];
  _status: STATUS_PRODUCT_KEYS;
}
export interface SkuModel extends Model {
  productId: ModelId;
  name: string;
  slugify: string;
  price: number;
  discountPrice: number;
  specs: SkuSpec[];
  stock: number;
  imageIds: ModelIds;
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
  categoryId: string;
  attrs: ProductAttr[];
  options: ProductOption[];
  skus: { name: string; price: number; discountPrice: number; specs: { key: string; value: string }[] }[];
};

export type ProductModelProperties = keyof WithId<ProductModel>;
export type SkuModelProperties = keyof WithId<SkuModel>;
