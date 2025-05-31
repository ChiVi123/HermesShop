'use client';

import { useContext } from 'react';
import { cn } from '~/lib/utils';
import { productContext } from './ProductContext';

type Props = {
  className?: string;
};
export default function ProductPrice({ className }: Props) {
  const {
    current: { price, discountPrice },
  } = useContext(productContext);

  return (
    <div
      className={cn(
        'flex gap-2 [&_[data-name]]:text-lg [&_[data-name="discountPrice"]]:text-red-800',
        {
          '[&_[data-name="price"]]:text-muted-foreground [&_[data-name="price"]]:line-through': discountPrice < price,
        },
        className
      )}
    >
      {discountPrice < price && <span data-name='discountPrice'>${discountPrice}</span>}
      <span data-name='price'>${price}</span>
    </div>
  );
}
