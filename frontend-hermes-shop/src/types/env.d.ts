declare namespace NodeJS {
  interface ProcessEnv {
    BASE_URL: string | undefined;
    NEXT_PUBLIC_SERVER_API: string | undefined;
    NEXT_PUBLIC_TIMEOUT_CHECK_TOKEN: string | undefined;
    NEXT_PUBLIC_COOKIE_MAX_AGE: string | undefined;
    NEXT_PUBLIC_LOGIN_EMAIL: string | undefined;
    NEXT_PUBLIC_LOGIN_PASSWORD: string | undefined;
  }
}
