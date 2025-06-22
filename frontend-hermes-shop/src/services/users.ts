import { apiClient } from '~/lib/helpers/apiClient';

export async function getUserInfo(cookies: string) {
  return apiClient.setCookie(cookies).get('/v1/users/info').fetchError().json();
}
