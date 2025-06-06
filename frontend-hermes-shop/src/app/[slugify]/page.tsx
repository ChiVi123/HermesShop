import { StarHalfIcon, StarIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { FetchClientError } from '~/lib/fetchClient/FetchClientError';
import { apiClient } from '~/lib/helpers';
import { Product } from '~/types/product';
import ProductContext from './components/ProductContext';
import ProductImageSelect from './components/ProductImageSelect';
import ProductPrice from './components/ProductPrice';
import ProductSelectors from './components/ProductSelectors';

type Props = {
  params: Promise<{ slugify: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugify } = await params;
  const result = await apiClient.get(`/v1/products/${slugify}`).fetchError().json<Product>();

  if (result instanceof FetchClientError) return { title: result.json?.message, description: '' };

  return {
    title: result.name,
    description: result.shortDescription,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slugify: string }> }) {
  const { slugify } = await params;
  const result = await apiClient.get(`/v1/products/${slugify}`).fetchError().json<Product>();

  if (result instanceof FetchClientError) {
    return <div className='px-10 mt-12'>{result.json?.message}</div>;
  }

  return (
    <>
      <section className='grid grid-cols-12 gap-14 w-full px-10 mt-12'>
        <ProductContext variants={result.variants ?? []}>
          <ProductImageSelect />

          <div className='col-span-5'>
            <Breadcrumb className='mb-1'>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href='/'>Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/c/${result.category?.slugify}`}>{result.category?.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Basic */}
            <div className='mb-8 space-y-2'>
              <h1 className='text-3xl font-extrabold'>{result.name}</h1>
              <p>{result.shortDescription}</p>

              <ProductPrice />

              {/* Star rating */}
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

            <ProductSelectors />

            <div>
              <Button size='lg' className='w-full rounded-none'>
                Add to cart
              </Button>
            </div>
          </div>
        </ProductContext>
      </section>

      <section className='px-10 mt-12'>
        <Accordion type='single' collapsible className='w-full'>
          {result.attrs?.map(({ key, value }) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className='text-xl font-bold'>{key}</AccordionTrigger>
              <AccordionContent>
                <div dangerouslySetInnerHTML={{ __html: value }} className='text-editor-display'></div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
