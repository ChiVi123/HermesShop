import type { Image } from '~/models/imageModel';

export type Product = {
  skus: Sku[];
  category: string;
  name: string;
  shortDescription: string;
  options: {
    key: string;
    type: string;
  }[];
  specs: {
    key: string;
    value: string;
  }[];
};
export type Sku = {
  price: number;
  discountPrice: number;
  stock: number;
  images: string[] | Image[];
  specs: {
    key: string;
    value: string;
  }[];
};
export type DataJSON = {
  products: Product[];
  imageCached: Record<string, Image>;
  urlCached: string[];
};
