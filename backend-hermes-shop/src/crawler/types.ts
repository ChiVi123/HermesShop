import type { Image } from '~/models/imageModel';

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
};
export type Sku = {
  productId: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[] | Image[];
  specs: {
    key: string;
    value: string;
  }[];
};
export type ProductJSON = {
  products: Product[];
  urlCached: Record<string, boolean>;
};
export type ImageJSON = Record<string, Image>;
export type ProductInfoJSON = Record<string, Product>;
export type SkuJSON = Record<string, Sku[]>;
