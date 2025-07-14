import { apiClient } from '~/lib/helpers/apiClient';
import { apiRoute } from '~/lib/helpers/apiRoute';

export function refreshTokenFromNextServerToServer(cookies: string) {
  return apiClient.get('/v1/auth/refresh-token', { cookies }).json<{ accessToken: string }>() as Promise<{
    accessToken: string;
  }>;
}
export async function refreshTokenFromNextClientToNextServer() {
  await apiRoute.post('/api/refresh-token').fetchError().json();
}
