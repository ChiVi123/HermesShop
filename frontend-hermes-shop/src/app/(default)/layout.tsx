import { Fragment } from 'react';
import Header from '~/components/Header';

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Fragment>
      <Header />
      <main>{children}</main>
    </Fragment>
  );
}
