'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import Image from '~/components/Image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '~/components/ui/carousel';
import { cn } from '~/lib/utils';
import { productContext } from './ProductContext';

const SIZE_IMAGE_CAROUSEL_BUTTON = 62;
const SIZE_IMAGE_CAROUSEL_ITEM = 575;

export default function ProductImageSelect() {
  const { current: variant } = useContext(productContext);
  const [api, setApi] = useState<CarouselApi>();
  const [imageIndex, setImageIndex] = useState(1);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setImageIndex(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleThumbClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className='sticky top-0 flex self-start col-span-7'>
      <Carousel orientation='vertical' className='flex-1'>
        <CarouselContent>
          {variant?.images?.map((item, index) => (
            <CarouselItem key={item.publicId} onClick={() => handleThumbClick(index)}>
              <div className='m-2'>
                <Image
                  src={item?.url}
                  alt={item?.publicId}
                  width={SIZE_IMAGE_CAROUSEL_BUTTON}
                  height={SIZE_IMAGE_CAROUSEL_BUTTON}
                  className={cn('mx-auto ring-ring cursor-pointer', { 'ring-4': index + 1 === imageIndex })}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel setApi={setApi} opts={{ loop: true }} className='flex-[0_1_85.56548%]'>
        <CarouselContent>
          {variant?.images?.map((item) => (
            <CarouselItem key={item.publicId}>
              <Image
                src={item?.url}
                alt={item?.publicId ?? ''}
                width={SIZE_IMAGE_CAROUSEL_ITEM}
                height={SIZE_IMAGE_CAROUSEL_ITEM}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Button */}
        <CarouselPrevious className='top-[96%] left-[86%] -translate-full cursor-pointer' />
        <CarouselNext className='top-[96%] right-3/50 -translate-y-full cursor-pointer' />
      </Carousel>
    </div>
  );
}
