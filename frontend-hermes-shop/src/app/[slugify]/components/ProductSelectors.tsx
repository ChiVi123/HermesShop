'use client';

import { useContext, useState } from 'react';
import Image from '~/components/Image';
import { cn } from '~/lib/utils';
import { productContext, VariantItem } from './ProductContext';

type Size = VariantItem['sizes'][0];

const FIRST_IMAGE_INDEX = 0;
const SIZE_IMAGE_ITEM = 48;

export default function ProductSelectors() {
  const { current, variants, onChange } = useContext(productContext);
  const [currentSize, setCurrentSize] = useState<Size | undefined>(current?.sizes[0]);

  return (
    <>
      <div className='mb-2'>
        <span className='text-lg font-bold'>Color: </span>
        {current?.color}
      </div>

      <div className='grid grid-cols-6 gap-y-4 mb-6'>
        {variants.map((item) => (
          <div
            key={item.color}
            className={cn(
              'size-12 bg-accent rounded-full ring-2 ring-offset-2 ring-transparent overflow-hidden cursor-pointer',
              {
                'hover:ring-accent': item?.color !== current.color,
                'ring-amber-800': item?.color === current.color,
              }
            )}
            onClick={() => onChange(item)}
          >
            <Image
              src={item?.images[FIRST_IMAGE_INDEX]?.url}
              alt={item?.color}
              width={SIZE_IMAGE_ITEM}
              height={SIZE_IMAGE_ITEM}
            />
          </div>
        ))}
      </div>

      <div className='mb-2'>
        <span className='text-lg font-bold'>Select size: </span>
      </div>

      {/* TODO: active if size was chose */}
      <div className='grid grid-cols-8 gap-2 mb-6'>
        {current?.sizes?.map((item) => (
          <span
            key={item.size}
            data-state='inOfStock'
            className={cn(
              'relative flex items-center justify-center size-12 border rounded-sm text-sm cursor-pointer select-none',
              {
                'before:absolute before:inset-0 before:content-[""] before:block before:bg-[url(/images/out_of_stock.png)] before:invert':
                  !item.stock,
                'hover:data-[state=inOfStock]:bg-accent': item.size !== currentSize?.size,
                'bg-accent-foreground text-white': item.size === currentSize?.size,
              }
            )}
            onClick={() => setCurrentSize(item)}
          >
            {item.size}
          </span>
        ))}
      </div>
    </>
  );
}
