'use server';

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod/v4';
import { CONTENT_TYPE_JSON } from '~/lib/fetchClient/constants';
import { FetchClientError } from '~/lib/fetchClient/FetchClientError';
import { apiClient } from '~/lib/helpers/apiClient';
import { parseCookies } from '~/lib/helpers/parses';
import { LoginFormSchema } from '~/lib/validates/authValidate';

type ValidateError = ZodError<{
  email: string;
  password: string;
}>;
type LoginResult = { errors?: ValidateError; message?: string };

export async function login(_: unknown, formData: FormData): Promise<LoginResult> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error,
    };
  }

  const response = await apiClient
    .post('/v1/auth/login', {
      headers: { 'content-type': CONTENT_TYPE_JSON },
      body: JSON.stringify(validatedFields.data),
    })
    .fetchError()
    .res();

  if (response instanceof FetchClientError) {
    return { message: response.json?.message ?? response.message };
  }
  if (response instanceof Error) {
    return { message: response.message };
  }

  const cookieStore = await cookies();
  const cookiesParsed = response.headers.getSetCookie().map((item) => parseCookies(item));

  cookiesParsed.forEach((item) => {
    cookieStore.set({ ...(item as ResponseCookie) });
  });

  redirect('/profile');
}
