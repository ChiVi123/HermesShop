'use client';

import Image from 'next/image';
import { useContext } from 'react';
import { cn } from '~/lib/utils';
import { productContext } from './ProductContext';

const IMAGE_POS = 1;

export default function ProductSelectors() {
  const { current, variants, onChange } = useContext(productContext);

  return (
    <>
      <div className='mb-2'>
        <span className='text-lg font-bold'>Color: </span>
        {current?.color}
      </div>

      <div className='grid grid-cols-6 gap-2 mb-6'>
        {variants.map((item) => (
          <span
            key={item.color}
            className={cn('block size-10 rounded-full overflow-hidden', {
              'ring-2 ring-offset-2 ring-amber-800': item?.color === current.color,
            })}
            onClick={() => onChange(item)}
          >
            <Image src={item?.images[IMAGE_POS]?.url} alt={item?.color} width={40} height={40} />
          </span>
        ))}
      </div>

      <div className='mb-2'>
        <span className='text-lg font-bold'>Select size: </span>
      </div>

      <div className='grid grid-cols-8 gap-2 mb-6'>
        {current.sizes.map((item) => (
          <span
            key={item.size}
            className={cn('flex items-center justify-center size-12 border border-border rounded-sm', {
              // 'ring-2 ring-offset-2 ring-amber-800': item.color === variant.color,
            })}
          >
            {item.size}
          </span>
        ))}
      </div>
    </>
  );
}
