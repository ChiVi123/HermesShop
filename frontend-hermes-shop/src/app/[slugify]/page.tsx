import { StarHalfIcon, StarIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import ProductPrice from '~/components/ProductPrice';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import ProductImageSelect from './components/ProductImageSelect';
import ProductSelectors from './components/ProductSelectors';

type Props = {
  params: Promise<{ slugify: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugify } = await params;
  const serverApi = process.env.SERVER_API ? process.env.SERVER_API + `/v1/products/${slugify}` : '/api';
  const result = await fetch(serverApi).then((data) => data.json());

  return {
    title: result.name,
    description: result.shortDescription,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slugify: string }> }) {
  const { slugify } = await params;
  const serverApi = process.env.SERVER_API ? process.env.SERVER_API + `/v1/products/${slugify}` : '/api';
  const result = await fetch(serverApi).then((data) => data.json());
  const variant = result?.variants[0];

  return (
    <>
      <section className='grid grid-cols-12 gap-14 px-10 mt-12'>
        <ProductImageSelect images={variant.images} />

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
                  <Link href={`/c/${result?.category.slugify}`}>{result?.category.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Basic */}
          <div className='mb-8 space-y-2'>
            <h1 className='text-3xl font-extrabold'>{result?.name}</h1>
            <p>{result?.shortDescription}</p>

            <ProductPrice price={variant.price} discountPrice={variant.discountPrice} />

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

              <span className='leading-none'>({result?.rating})</span>
            </div>
          </div>

          {/* TODO: insert variants and options */}
          <ProductSelectors variants={result.variants} />

          <div>
            <Button size='lg' className='w-full rounded-none'>
              Add to cart
            </Button>
          </div>
        </div>
      </section>

      <section className='px-10 mt-12'>
        <Accordion type='single' collapsible className='w-full'>
          {result?.attrs.map(({ key, value }) => (
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
