import { PencilIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';

export default function EditProfileForm() {
  return (
    <>
      <span className='text-sm text-muted-foreground font-semibold'>Name</span>

      <Dialog>
        <DialogTrigger asChild>
          <Button aria-label='edit name' variant='ghost'>
            <PencilIcon size={12} />
          </Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>

          <form>
            <div className='grid gap-4'>
              <div className='grid gap-3'>
                <Switch id='default' />
                <Label htmlFor='firstName'>This is my default address</Label>
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input id='firstName' name='firstName' defaultValue='Pedro Duarte' />
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input id='lastName' name='lastName' defaultValue='@peduarte' />
              </div>
            </div>
          </form>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
