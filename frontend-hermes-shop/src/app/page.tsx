import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';

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

export default async function Home() {
  const serverApi = process.env.SERVER_API ? process.env.SERVER_API + '/v1/products/all' : '/';
  const result = await fetch(serverApi).then((data) => data.json());

  return (
    <div className='my-12'>
      <section className='px-10 mb-10'>
        <div className='flex items-center gap-2 w-full'>
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

      <section>
        <h2 className='px-10 mb-8 text-xl font-bold'>More To Shop</h2>

        {Array.isArray(result) && (
          <Carousel opts={{ align: 'start', loop: true }} className='[&_>_div]:px-10'>
            <CarouselContent className='-ml-2'>
              {result.map(({ _id, name, sku }) => (
                <CarouselItem key={_id} className='basis-1/4 pl-2'>
                  <Card className='gap-4 py-0 h-full border-0 rounded-none shadow-none'>
                    <CardHeader className='px-0'>
                      <div className='mb-2 bg-accent overflow-hidden group'>
                        <Image
                          src={sku.images[0].url}
                          alt={name}
                          width={sku.images[0].width * 0.75}
                          height={sku.images[0].height * 0.75}
                          className='size-full transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-105'
                        />
                      </div>

                      <CardTitle className='font-bold'>{name}</CardTitle>
                      <CardDescription className='text-base'>
                        {sku.specs[0].value.replace(/\s*\(.*?\)/, '')}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className='flex items-center gap-1 px-0 font-semibold'>
                      <span className='text-red-800'>$90</span>
                      <span className='line-through'>${sku.price}</span>
                    </CardContent>
                  </Card>
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
