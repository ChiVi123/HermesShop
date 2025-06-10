// import { cookies } from 'next/headers';
import { FetchClient } from './fetchClient/FetchClient';
import { isServer } from './fetchClient/utils';

const baseUrl = process.env.SERVER_API ?? '';

export const apiClient = new FetchClient(baseUrl);

apiClient.interceptors.request.use(
  async (config) => {
    console.log('interceptors.request onFulfilled');
    // if (isServer()) {
    //   const cookie = (await cookies()).get('__next_hmr_refresh_hash__');
    //   console.log('cookie', cookie);
    // } else {
    //   const elements = document.querySelectorAll('h2');
    //   console.log(elements);
    // }

    if (!isServer()) {
      const elements = document.querySelectorAll('.interceptor-loading') as NodeListOf<HTMLElement>;
      elements.forEach((element) => {
        element.style.opacity = '0.5';
      });
    }
    return config;
  },
  (error) => {
    console.log('interceptors.request onRejected');
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  async (response) => {
    console.log('interceptors.response onFulfilled');

    if (!isServer()) {
      const elements = document.querySelectorAll('.interceptor-loading') as NodeListOf<HTMLElement>;
      elements.forEach((element) => {
        element.style.opacity = 'initial';
      });
    }
    return response;
  },
  (error) => {
    console.log('interceptors.response onRejected');
    return Promise.reject(error);
  }
);
