import { apiClient } from '~/lib/helpers/apiClient';

export function refreshToken() {
  return apiClient.get('/v1/auth/refresh-token').fetchError().json<{ accessToken: string }>();
}
