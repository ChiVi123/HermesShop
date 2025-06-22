'use client';

import { Loader2Icon } from 'lucide-react';
import pc from 'picocolors';
import { useActionState } from 'react';
import { login } from '~/actions/authActions';
import { Button } from '~/components/ui/button';
import { CardContent, CardFooter } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';

export default function Form() {
  const [state, action, pending] = useActionState(login, { errors: undefined, message: undefined });

  console.log(pc.green('state: '), state);

  return (
    <>
      <CardContent>
        <form id='loginForm' action={action}>
          <div className='flex flex-col gap-6'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                name='email'
                autoComplete='username'
                placeholder='m@example.com'
                required
              />
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                <a href='#' className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
                  Forgot your password?
                </a>
              </div>
              <Input id='password' type='password' name='password' autoComplete='current-password' required />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className='flex-col gap-2'>
        <Button type='submit' form='loginForm' disabled={pending} className='w-full'>
          {pending && <Loader2Icon className='animate-spin' />}
          {pending ? 'Please wait' : 'Login'}
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
    </>
  );
}
