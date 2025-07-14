import { apiClient } from '~/lib/helpers/apiClient';
import { User } from '~/types/user';

type UserResponse = Omit<User, 'accessToken' | 'refreshToken'>;

export async function getUserInfo(cookies: string) {
  return apiClient.get('/v1/users/info', { cookies }).fetchError().json<UserResponse>();
}
