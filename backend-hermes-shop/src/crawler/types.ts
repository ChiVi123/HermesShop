import type { ImageModel } from '~/models/imageModel';

export type Product = {
  category: string;
  name: string;
  shortDescription: string;
  options: {
    key: string;
    type: string;
  }[];
  attrs: {
    key: string;
    value: string;
  }[];
  skuIds: string[];
};
export type Sku = {
  productId: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[] | ImageModel[];
  specs: {
    key: string;
    value: string;
  }[];
};
export type ImageJSON = Record<string, ImageModel>;
export type ProductJSON = Record<string, Product>;
export type SkuJSON = Record<string, Sku[]>;
