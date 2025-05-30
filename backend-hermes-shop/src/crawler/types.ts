import type { ImageModel } from '~/models/imageModel';

export type Product = {
  category: string;
  name: string;
  shortDescription: string;
  attrs: {
    key: string;
    value: string;
  }[];
  variantIds: string[];
};
export type ProductVariant = {
  productId: string;
  color: string;
  price: number;
  discountPrice: number;
  images: string[] | ImageModel[];
  sizes: {
    size: string;
    stock: number;
  }[];
};
export type ImageJSON = Record<string, ImageModel>;
export type ProductJSON = Record<string, Product>;
export type ProductVariantJSON = Record<string, ProductVariant>;
