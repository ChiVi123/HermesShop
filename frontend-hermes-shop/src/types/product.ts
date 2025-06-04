import { Category } from './category';
import { ImageModel } from './image';

export interface Product {
  _id: string;
  name: string;
  slugify: string;
  shortDescription: string;
  category: Category;
  rating: number;
  gender: string;
  attrs: {
    key: string;
    value: string;
  }[];
  variants: ProductVariant[];
  createdAt: number;
  updatedAt: number;
}
export type ProductItem = Omit<Product, 'shortDescription' | 'attrs'> & { variant: ProductVariant };

interface ProductVariant {
  _id: string;
  productId: string;
  name: string;
  slugify: string;
  color: string;
  price: number;
  discountPrice: number;
  sizes: {
    size: string;
    stock: number;
  }[];
  images: ImageModel[];
}
