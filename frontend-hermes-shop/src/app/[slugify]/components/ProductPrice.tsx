'use client';

import { useContext } from 'react';
import { cn } from '~/lib/utils';
import { productContext } from './ProductContext';

type Props = {
  className?: string;
};
export default function ProductPrice({ className }: Props) {
  const { current } = useContext(productContext);
  const isDiscount = current?.discountPrice < current?.price;

  return (
    <div
      className={cn(
        'flex gap-2 [&_[data-name]]:text-lg [&_[data-name="discountPrice"]]:text-red-800',
        {
          '[&_[data-name="price"]]:text-muted-foreground [&_[data-name="price"]]:line-through': isDiscount,
        },
        className
      )}
    >
      {isDiscount && <span data-name='discountPrice'>${current?.discountPrice}</span>}
      <span data-name='price'>${current?.price}</span>
    </div>
  );
}
