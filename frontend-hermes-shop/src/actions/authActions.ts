'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod/v4';
import { cookieOptions, RoutePage, TokenName } from '~/constants';
import { FetchClientError } from '~/lib/fetchClient/FetchClientError';
import { apiClient } from '~/lib/helpers/apiClient';
import { LoginFormSchema } from '~/lib/validates/authValidate';
import { User } from '~/types/user';

type ValidateError = ZodError<{
  email: string;
  password: string;
}>;

export async function login(_: unknown, formData: FormData): Promise<{ errors?: ValidateError; message: string }> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error,
      message: 'invalid fields',
    };
  }

  const result = await apiClient.post('/v1/auth/login', { data: validatedFields.data }).fetchError().json<User>();

  if (result instanceof Error) {
    return { message: result instanceof FetchClientError ? result.json?.message ?? result.message : result.message };
  }

  const cookieStore = await cookies();
  cookieStore.set(TokenName.ACCESS_TOKEN, result.accessToken, cookieOptions);
  cookieStore.set(TokenName.REFRESH_TOKEN, result.refreshToken, cookieOptions);

  redirect(RoutePage.PROFILE);
}
