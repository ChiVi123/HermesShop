'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';

export type VariantItem = {
  color: string;
  price: number;
  discountPrice: number;
  images: { publicId: string; url: string }[];
  sizes: { size: string; stock: number }[];
};
type VariantContext = {
  current: VariantItem;
  variants: VariantItem[];
  onChange: Dispatch<SetStateAction<VariantItem>>;
};

interface Props {
  variants: VariantItem[];
  children: ReactNode;
}

const initial = { color: '', price: 0, discountPrice: 0, images: [], sizes: [] };

export const productContext = createContext<VariantContext>({
  current: initial,
  variants: [],
  onChange: () => {},
});

export default function ProductContext({ variants, children }: Props) {
  const [variant, setVariant] = useState<VariantItem>(initial);

  return (
    <productContext.Provider value={{ current: variant, variants, onChange: setVariant }}>
      {children}
    </productContext.Provider>
  );
}
