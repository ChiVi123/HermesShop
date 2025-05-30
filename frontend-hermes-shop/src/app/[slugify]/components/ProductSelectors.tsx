'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '~/lib/utils';

interface Props {
  options: { key: string; type: string }[];
  skus: { images: { url: string }[]; specs: { key: string; value: string }[] }[];
}

const COLOR_POS = 0;
const SIZE_POS = 1;
const IMAGE_POS = 1;

export default function ProductSelectors({ options, skus }: Props) {
  const [color, setColor] = useState('');

  const selectorName = options[COLOR_POS].key;
  const selector = skus.reduce((prev, current) => {
    const specify = current.specs.find((spec) => spec.key === selectorName);
    if (specify && !prev.some((item) => item.value === specify.value)) {
      prev.push({ value: specify.value, url: current.images[IMAGE_POS].url });
    }
    return prev;
  }, [] as { value: string; url: string }[]);

  return (
    <>
      <div className='mb-2'>
        <span className='text-lg font-bold'>Color: </span>
        {color}
      </div>
      <div className='grid grid-cols-6 gap-2 mb-6'>
        {selector.map((item) => (
          <span
            key={item.value}
            className={cn('block size-10 rounded-full overflow-hidden', {
              'ring-2 ring-offset-2 ring-amber-800': item.value === color,
            })}
            onClick={() => setColor(item.value)}
          >
            <Image src={item.url} alt={item.value} width={40} height={40} />
          </span>
        ))}
      </div>
    </>
  );
}
