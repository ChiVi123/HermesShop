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
  images: string[];
  specs: {
    key: string;
    value: string;
  }[];
};
export type ProductJSON = {
  products: Product[];
  urlCached: Record<string, boolean>;
};
