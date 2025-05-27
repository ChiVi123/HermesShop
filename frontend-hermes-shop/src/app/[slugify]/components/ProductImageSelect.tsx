'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';

type ImageItem = {
  publicId: string;
  url: string;
  width: number;
  height: number;
};

interface Props {
  images: ImageItem[];
  className?: string;
}

export default function ProductImageSelect({ images, className }: Props) {
  const [image, setImage] = useState<ImageItem>(images[0]);

  useEffect(() => {
    setImage(images[0]);
  }, [images]);

  return (
    <div className={cn('col-span-7 flex gap-6', className)}>
      <div className='flex flex-col gap-1.5'>
        {images.map((item) => (
          <Image
            key={item.publicId}
            src={item.url}
            alt={item.publicId}
            width={62}
            height={62}
            className={cn({ 'ring-ring ring-2': image.publicId === item.publicId })}
            onClick={() => setImage(item)}
          />
        ))}
      </div>

      <div className='bg-accent size-full aspect-square'>
        <Image
          key={image.publicId}
          src={image.url}
          alt={image.publicId}
          width={575}
          height={575}
          className='size-full'
        />
      </div>
    </div>
  );
}
