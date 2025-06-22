'use client';

import { SearchIcon, ShoppingCartIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '~/components/ui/separator';

export default function Header() {
  return (
    <header>
      <div className='flex justify-between items-center px-7 py-3 shadow-black/9 shadow-[0px_2px_24px_0px]'>
        <nav className='flex items-center gap-8'>
          <Link href='/' className='font-bold hover:underline'>
            Men
          </Link>
          <Link href='/' className='font-bold hover:underline'>
            Women
          </Link>
          <Link href='/' className='font-bold text-red-900 hover:underline'>
            Sale
          </Link>
        </nav>

        <h1 className='text-3xl font-bold italic'>HermesShop</h1>

        <div className='flex items-center gap-6 h-6'>
          <Link href='/' className='font-bold hover:underline'>
            Rerun
          </Link>

          <Separator orientation='vertical' />

          <div className='flex items-center gap-4'>
            <SearchIcon />
            <Link href='/login'>
              <UserIcon />
            </Link>
            <ShoppingCartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
