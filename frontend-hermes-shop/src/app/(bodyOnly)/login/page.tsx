import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';

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

        <CardContent>
          <form>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='m@example.com' required />
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <a href='#' className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                    Forgot your password?
                  </a>
                </div>
                <Input id='password' type='password' required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-2'>
          <Button type='submit' className='w-full'>
            Login
          </Button>

          <div className='flex items-center gap-x-3.5 w-full my-4'>
            <Separator className='flex-1 w-auto' />
            or
            <Separator className='flex-1 w-auto' />
          </div>

          <Button variant='outline' className='w-full'>
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
