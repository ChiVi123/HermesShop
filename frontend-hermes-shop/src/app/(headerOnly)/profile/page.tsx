import { CircleAlertIcon, PlusIcon } from 'lucide-react';
import picocolors from 'picocolors';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { getCookiesString } from '~/lib/helpers/cookies';
import { getUserInfo } from '~/services/users';
import EditProfileForm from './components/EditProfileForm';

const ADDRESSES = [
  {
    firstName: '',
    lastName: 'camlord',
    province: 'Tokyo',
    ward: 'Shibuya',
    district: '',
    country: 'Japan',
    isDefault: true,
  },
  {
    firstName: '',
    lastName: 'camlord',
    province: 'Nagano',
    ward: '',
    district: 'Kiso',
    country: 'Japan',
  },
  {
    firstName: 'cham chi',
    lastName: 'camlord',
    province: 'Tokyo',
    ward: 'Shibuya',
    district: '',
    country: 'Japan',
  },
  {
    firstName: '',
    lastName: 'camlord',
    province: 'Tokyo',
    ward: 'Shibuya',
    district: '',
    country: 'Japan',
  },
  {
    firstName: '',
    lastName: 'camlord',
    province: 'Hokkaido',
    ward: '',
    district: 'Abuta',
    country: 'Japan',
  },
  {
    firstName: '',
    lastName: 'camlord',
    province: 'Kanagawa',
    ward: 'Naka',
    district: '',
    country: 'Japan',
  },
];

export default async function ProfilePage() {
  const cookieHeader = await getCookiesString();
  const user = await getUserInfo(cookieHeader);

  console.log(picocolors.magenta('user'), user);

  return (
    <main className='min-h-screen pt-6 bg-accent'>
      <h1 className='max-w-5xl mx-auto mb-8 px-7 text-xl font-bold'>Profile</h1>

      <div className='max-w-5xl mx-auto space-y-6'>
        <div className='flex flex-col gap-y-2 mx-7 p-5 bg-white rounded-2xl'>
          <div className='flex items-center gap-x-2'>
            <EditProfileForm />
          </div>

          <div className='flex flex-col gap-y-1'>
            <span className='text-sm text-muted-foreground font-semibold'>Email</span>
            <span className='text-sm font-semibold'>m@gmail.com</span>
          </div>
        </div>

        <div className='mx-7 p-5 bg-white rounded-2xl space-y-2'>
          <div className='flex items-center gap-x-1.5 mb-5'>
            <div className='text-2xl font-semibold'>Addresses</div>
            <Button variant='ghost' className='font-bold'>
              <PlusIcon />
              Add
            </Button>
          </div>

          <Alert>
            <CircleAlertIcon />
            <AlertTitle>No addresses added</AlertTitle>
          </Alert>

          <div className='grid grid-cols-12 gap-x-4 gap-y-2 -mx-2'>
            {ADDRESSES.map((item, index) => (
              <div
                key={index}
                className='col-span-3 p-2 rounded-lg transition-[background-color] duration-700 hover:bg-accent'
              >
                <div className='flex flex-col flex-start cursor-pointer'>
                  {item.isDefault && <div className='font-semibold text-muted-foreground'>Default address</div>}
                  <div className='text-sm font-semibold'>{`${item.firstName} ${item.lastName}`}</div>
                  <div className='text-sm font-semibold'>{item.district}</div>
                  <div className='text-sm font-semibold'>{item.ward}</div>
                  <div className='text-sm font-semibold'>{item.province}</div>
                  <div className='text-sm font-semibold'>{item.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
