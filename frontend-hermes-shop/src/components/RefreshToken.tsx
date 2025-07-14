'use client';

import ms from 'ms';
import { useEffect } from 'react';
import { refreshTokenFromNextClientToNextServer } from '~/services/auth';

const TIMEOUT = ms((process.env.NEXT_PUBLIC_TIMEOUT_CHECK_TOKEN as ms.StringValue) ?? '1h');

console.log('timeout', TIMEOUT);

export default function RefreshToken() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshTokenFromNextClientToNextServer();
    }, TIMEOUT);
    return () => clearInterval(interval);
  }, []);
  return null;
}
