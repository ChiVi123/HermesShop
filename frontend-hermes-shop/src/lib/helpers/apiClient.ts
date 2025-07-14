// import picocolors from 'picocolors';
// import { FETCH_ERROR } from '~/lib/fetchClient/constants';
import { FetchClient } from '~/lib/fetchClient/FetchClient';
// import { FetchClientError } from '~/lib/fetchClient/FetchClientError';
// import { StatusCodes } from '~/lib/fetchClient/StatusCodes';
// import { apiRoute } from '~/lib/helpers/apiRoute';
// import { isServer } from '~/lib/utils';
// import { refreshToken } from '~/services/auth';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_API ?? '';

export const apiClient = new FetchClient(baseUrl);

// apiClient.interceptors.request.use(
//   async (config) => {
//     // throw new Error('throw from request');

//     config.credentials = !isServer() ? 'include' : undefined;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// apiClient.interceptors.response.use(
//   async (response) => response,
//   async (error) => {
//     const clientError = error[FETCH_ERROR];
//     if (!clientError || !(clientError instanceof FetchClientError)) {
//       return Promise.reject(error);
//     }

//     const retryConfig = clientError.retryConfig;
//     const message = clientError.json?.message ?? clientError.message;

//     if (clientError.status !== StatusCodes.GONE) {
//       console.log(picocolors.red('interceptors.response onRejected not status gone:'), clientError.status, message);
//       return Promise.reject(error);
//     }
//     if (retryConfig.options.retry) {
//       return Promise.reject(error);
//     }

//     const originUrl = isServer() ? process.env.BASE_URL : '';

//     retryConfig.options.retry = true;

//     return refreshToken().then(async (data) => {
//       if (data instanceof Error) return Promise.reject(data);

//       const refreshResponse = await apiRoute
//         .post(originUrl + '/api/refresh-token', { data })
//         .fetchError()
//         .res();
//       if (refreshResponse instanceof Error) return Promise.reject(refreshResponse);

//       return apiClient.retry(clientError.url, retryConfig).fetchError().res();
//     });
//   }
// );
