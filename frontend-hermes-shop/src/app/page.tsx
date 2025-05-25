import Image from 'next/image';
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
    <div className='mx-10 my-12'>
      <div className='flex items-center gap-2 w-full mb-8'>
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

      {Array.isArray(result) && (
        <Carousel>
          <CarouselContent>
            {result.map((item) => (
              <CarouselItem key={item._id} className='basis-1/4'>
                <h3 className='font-bold'>{item.name}</h3>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className='left-0' />
          <CarouselNext className='right-0' />
        </Carousel>
      )}

      <div className='pb-12'></div>
    </div>
  );
}
