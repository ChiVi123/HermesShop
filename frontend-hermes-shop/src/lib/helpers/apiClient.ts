import picocolors from 'picocolors';
import { FetchClient } from '~/lib/fetchClient/FetchClient';
import { FetchClientError } from '~/lib/fetchClient/FetchClientError';
import { StatusCodes } from '~/lib/fetchClient/StatusCodes';
import { isServer } from '~/lib/utils';
import { refreshToken } from '~/services/auth';

const baseUrl = process.env.SERVER_API ?? '';

export const apiClient = new FetchClient(baseUrl);

apiClient.interceptors.request.use(
  async (config) => {
    // throw new Error('throw from request');
    config.credentials = !isServer() ? 'same-origin' : undefined;
    return config;
  },
  (error) => {
    console.log(picocolors.red('interceptors.request onRejected'));
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!(error instanceof FetchClientError)) return Promise.reject(error);

    const retryConfig = error.retryConfig;
    const message = error.json?.message ?? error.message;

    console.log(picocolors.red('interceptors.response onRejected'), retryConfig);

    if (error.status !== StatusCodes.GONE) {
      console.log(picocolors.red('interceptors.response onRejected'), message);
      return Promise.reject(error);
    }
    if (retryConfig.options.retry) {
      return Promise.reject(error);
    }

    retryConfig.options.retry = true;

    return refreshToken().then((value) => {
      if (value instanceof Error || value instanceof FetchClientError) return Promise.reject(value);
      return apiClient.retry(error.url, retryConfig);
    });
  }
);
