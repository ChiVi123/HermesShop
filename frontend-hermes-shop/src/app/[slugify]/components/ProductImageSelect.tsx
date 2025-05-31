'use client';

import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { FALLBACK_IMAGE_URL } from '~/constants';
import { cn } from '~/lib/utils';
import { productContext, VariantItem } from './ProductContext';

type ImageItem = VariantItem['images'][0];

interface Props {
  className?: string;
}

export default function ProductImageSelect({ className }: Props) {
  const { current } = useContext(productContext);
  const [image, setImage] = useState<ImageItem>(current.images[0]);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    setImage(current.images[0]);
    setImageError(false);
  }, [current]);

  return (
    <div className={cn('col-span-7 flex gap-6', className)}>
      <div className='flex flex-col gap-1.5'>
        {current.images.map((item) => (
          <Image
            key={item?.publicId}
            src={item?.url}
            alt={item?.publicId}
            width={62}
            height={62}
            className={cn({ 'ring-ring ring-2': item?.publicId === image?.publicId })}
            onClick={() => setImage(item)}
          />
        ))}
      </div>

      <div className='bg-accent'>
        <Image
          src={imageError ? FALLBACK_IMAGE_URL : image?.url ?? FALLBACK_IMAGE_URL}
          alt={image?.publicId ?? ''}
          width={575}
          height={575}
          priority
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
}
