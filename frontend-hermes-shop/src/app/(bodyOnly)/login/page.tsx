import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import Form from './components/Form';

export const metadata: Metadata = {
  title: 'Login - Hermes Shop',
  description: '',
};

export default function LoginPage() {
  return (
    <main className='flex justify-center min-h-screen'>
      <Card className='w-full max-w-sm my-4'>
        <Link href='/' className='mx-6 text-3xl font-bold italic'>
          HermesShop
        </Link>

        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
          <CardAction>
            <Button variant='link'>Sign Up</Button>
          </CardAction>
        </CardHeader>

        <Form />
      </Card>
    </main>
  );
}
