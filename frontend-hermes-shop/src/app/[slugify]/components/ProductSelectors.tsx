'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '~/lib/utils';

interface Props {
  variants: { color: string; images: { url: string }[]; sizes: { size: string; stock: number }[] }[];
}

const IMAGE_POS = 1;

export default function ProductSelectors({ variants }: Props) {
  const [color, setColor] = useState('');

  return (
    <>
      <div className='mb-2'>
        <span className='text-lg font-bold'>Color: </span>
        {color}
      </div>
      <div className='grid grid-cols-6 gap-2 mb-6'>
        {variants.map((item) => (
          <span
            key={item.color}
            className={cn('block size-10 rounded-full overflow-hidden', {
              'ring-2 ring-offset-2 ring-amber-800': item.color === color,
            })}
            onClick={() => setColor(item.color)}
          >
            <Image src={item.images[IMAGE_POS].url} alt={item.color} width={40} height={40} />
          </span>
        ))}
      </div>
    </>
  );
}
