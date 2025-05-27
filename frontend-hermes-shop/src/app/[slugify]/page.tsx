import { ChevronDownIcon, StarHalfIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { cn } from '~/lib/utils';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slugify: string }> }) {
  const { slugify } = await params;
  const serverApi = process.env.SERVER_API ? process.env.SERVER_API + `/v1/products/${slugify}` : '/api';
  const result = await fetch(serverApi).then((data) => data.json());

  const sku = result.skus[78];

  return (
    <>
      <section className='grid grid-cols-12 gap-14 px-10 mt-12'>
        <div className='col-span-7 flex gap-6'>
          <div className='flex flex-col gap-1.5'>
            {sku.images.map((item, index) => (
              <Image
                key={item.publicId}
                src={item.url as string}
                alt={item.publicId}
                width={62}
                height={62}
                className={cn({ 'ring-ring ring-2': index === 0 })}
              />
            ))}
          </div>

          <div className='bg-accent aspect-square'>
            <Image
              key={sku.images[0].publicId}
              src={sku.images[0].url as string}
              alt={sku.images[0].publicId}
              width={575}
              height={575}
              className='size-full'
            />
          </div>
        </div>

        <div className='col-span-5'>
          <Breadcrumb className='mb-1'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/'>Home </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/c/${result.category.slugify}`}>{result.category.name} </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Basic */}
          <div className='mb-8 space-y-2'>
            <h1 className='text-3xl font-extrabold'>{result.name}</h1>
            <p>{result.shortDescription}</p>

            <div className='flex gap-2'>
              <span className='text-lg text-red-800'>${sku.discountPrice}</span>
              <span className='text-lg text-muted-foreground line-through'>${sku.price}</span>
            </div>

            <div className='relative flex gap-4'>
              <div className='flex gap-1'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={'star_bg_' + index}
                    fill='currentColor'
                    strokeWidth={0}
                    size={16}
                    className='text-accent'
                  />
                ))}
              </div>

              <div className='absolute top-0 flex gap-1'>
                <StarIcon fill='currentColor' strokeWidth={0} size={16} className='text-accent-foreground' />
                <StarIcon fill='currentColor' strokeWidth={0} size={16} className='text-accent-foreground' />
                <StarIcon fill='currentColor' strokeWidth={0} size={16} className='text-accent-foreground' />
                <StarHalfIcon fill='currentColor' strokeWidth={0} size={16} className='text-accent-foreground' />
              </div>

              <span className='leading-none'>({result.rating})</span>
            </div>
          </div>

          {/* TODO: insert variants and options */}

          <div>
            <Button size='lg' className='w-full rounded-none'>
              Add to cart
            </Button>
          </div>
        </div>
      </section>

      <section className='px-10 mt-12'>
        {result.specs.map(({ key, value }) => (
          <Collapsible key={key} className='border-border border-t'>
            <CollapsibleTrigger className='flex items-center justify-between w-full py-6 text-3xl font-bold group'>
              {key}
              <ChevronDownIcon className='transition-transform duration-500 ease-in-out group-[&[data-state="open"]]:rotate-180' />
            </CollapsibleTrigger>
            <CollapsibleContent className='bg-white overflow-hidden transition-[height] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'>
              <div dangerouslySetInnerHTML={{ __html: value }}></div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </section>
    </>
  );
}
