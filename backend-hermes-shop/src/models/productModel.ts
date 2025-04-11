import type { ObjectId, WithId } from 'mongodb';
import type { Image } from '~/models/imageModel';
import type { Model, ModelResponse } from '~/models/model';

export interface ProductModel extends Model {
  name: string;
  slugify: string;
  shortDescription: string;
  rating: number;
  gender: string;
  attrs: ProductAttr[];
  skuIds: (string | ObjectId)[];
}
export interface SkuModel extends Model {
  productId: string | ObjectId;
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
