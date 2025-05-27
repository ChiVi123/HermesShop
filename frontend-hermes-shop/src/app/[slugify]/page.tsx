import { ChevronDownIcon, StarHalfIcon, StarIcon } from 'lucide-react';
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
import ProductImageSelect from './components/ProductImageSelect';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slugify: string }> }) {
  const { slugify } = await params;
  const serverApi = process.env.SERVER_API ? process.env.SERVER_API + `/v1/products/${slugify}` : '/api';
  const result = await fetch(serverApi).then((data) => data.json());

  const sku = result.skus[78];

  return (
    <>
      <section className='grid grid-cols-12 gap-14 px-10 mt-12'>
        <ProductImageSelect images={sku.images} />

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
            <CollapsibleTrigger className='flex items-center justify-between w-full py-6 text-2xl font-bold group'>
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
