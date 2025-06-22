import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import { apiClient } from '~/lib/helpers/apiClient';
import { cn } from '~/lib/utils';
import { ProductItem } from '~/types/product';

const SLIDES = [
  {
    title: 'Bestseller',
    description: 'Fan-Favorite Sneakers, Flats, and Slip-Ons',
    imageSrc: '/images/home_page_left_collection.avif',
  },
  {
    title: 'New Arrivals',
    description: 'The Latest Styles & Limited-Edition Colors',
    imageSrc: '/images/home_page_center_collection.avif',
  },
  {
    title: 'Spring Essentials',
    description: 'Breezy Shoes For Warmer Days Ahead',
    imageSrc: '/images/home_page_right_collection.avif',
  },
];
const FIRST_IMAGE_INDEX = 0;

export default async function Home() {
  const products = await apiClient.get('/v1/products/all').fetchError().json<ProductItem[]>();

  return (
    <div className='my-12'>
      <section className='mb-10'>
        <div className='flex items-center gap-2 w-full px-10'>
          {SLIDES.map((item) => (
            <div key={item.title} className='relative w-1/3 min-w-1/3 aspect-[4/5] overflow-hidden group'>
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                priority
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='max-h-full object-cover -z-10 transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105'
              />
              <div className='h-full px-8 py-16 bg-black/20'>
                <h2 className='text-2xl font-bold text-center text-white'>{item.title}</h2>
                <p className='text-center text-white'>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='mb-10'>
        <div className='grid grid-cols-2 gap-2 px-10'>
          <div className='relative overflow-hidden group'>
            <Image
              src='/images/home_page_rock_and_stroll.avif'
              alt='home_page_rock_and_stroll'
              width={2000 * 0.4}
              height={2000 * 0.4}
              priority
              className='size-full object-cover -z-10 transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105'
            />

            <div className='absolute right-0 bottom-0 left-0 p-10 text-white'>
              <p className='text-2xl font-bold'>Rock And Stroll In Comfort</p>
              <p className='text-lg'>
                Effortlessly comfy styles take color cues from the Southwest’s rustic rock formations.
              </p>
            </div>
          </div>

          {Array.isArray(products) && (
            <div className='grid grid-cols-2 gap-2'>
              {products.slice(0, 4).map(({ _id, name, variant }) => (
                <div key={_id} className='bg-accent'>
                  <div className='mb-2 overflow-hidden group'>
                    <Image
                      src={variant.images[FIRST_IMAGE_INDEX].url}
                      alt={name}
                      width={variant.images[FIRST_IMAGE_INDEX].width * 0.25}
                      height={variant.images[FIRST_IMAGE_INDEX].height * 0.25}
                      className='size-full transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105'
                    />
                  </div>

                  <div className='flex justify-between px-4'>
                    <p className='text-sm font-bold'>{name}</p>
                    <p className='flex items-center gap-1 text-xs font-semibold'>
                      <span className='text-red-800'>$90</span>
                      <span className='line-through'>${variant.price}</span>
                    </p>
                  </div>

                  <p className='p-4 text-xs font-semibold'>{variant.color.replace(/\s*\(.*?\)/, '')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className='px-10 mb-8 text-xl font-bold'>More To Shop</h2>

        {Array.isArray(products) && (
          <Carousel opts={{ align: 'start', loop: true }} className='[&_>_div]:px-10'>
            <CarouselContent className='-ml-2'>
              {products.map(({ _id, name, slugify, variant }) => (
                <CarouselItem key={_id} className='basis-1/4 pl-2'>
                  <Link href={`/${slugify}`} className='h-full'>
                    <Card className='gap-4 py-0 h-full border-0 rounded-none shadow-none group'>
                      <CardHeader className='px-0'>
                        <div className='mb-2 bg-accent overflow-hidden'>
                          <Image
                            src={variant.images[FIRST_IMAGE_INDEX].url}
                            alt={name}
                            width={variant.images[FIRST_IMAGE_INDEX].width * 0.1}
                            height={variant.images[FIRST_IMAGE_INDEX].height * 0.1}
                            className='size-full transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105'
                          />
                        </div>

                        <CardTitle className='font-bold'>{name}</CardTitle>
                        <CardDescription className='text-base'>
                          {variant.color.replace(/\s*\(.*?\)/, '')}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className='flex items-center gap-1 px-0 font-semibold'>
                        {variant.price > variant.discountPrice && (
                          <span className='text-red-800'>${variant.discountPrice}</span>
                        )}
                        <span className={cn({ 'line-through': variant.price > variant.discountPrice })}>
                          ${variant.price}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className='left-0 translate-x-1/2 size-10' />
            <CarouselNext className='right-0 -translate-x-1/2 size-10' />
          </Carousel>
        )}
      </section>

      <div className='pb-12'></div>
    </div>
  );
}
