'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RoutePage } from '~/constants';
import { apiRoute } from '~/lib/helpers/apiRoute';

export default function LogoutPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const controller = new AbortController();

    apiRoute
      .get('/api/logout', { signal: controller.signal })
      .fetchError()
      .res()
      .finally(() => {
        router.push(`${RoutePage.LOGIN}?redirectFrom=${pathname}`);
      });

    return () => {
      controller.abort();
    };
  }, [pathname, router]);
  return null;
}
