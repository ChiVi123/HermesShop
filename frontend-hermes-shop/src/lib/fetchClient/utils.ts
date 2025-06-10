import { FulfilledHandler, RejectedHandler, RequestOptions } from './types';

export function handleRequestInterceptors(
  options: RequestOptions,
  handlers: (RejectedHandler | FulfilledHandler<RequestOptions>)[]
): Promise<RequestOptions> {
  const length = handlers.length;
  const promise = new Promise<RequestOptions>((resolve) => {
    resolve(options);
  });

  let index = 0;

  while (index < length) {
    const onFulfilled: FulfilledHandler<RequestOptions> = handlers[index++];
    const onRejected: RejectedHandler = handlers[index++];

    promise.then(onFulfilled).catch(onRejected);
  }

  return promise;
}
export function handleResponseInterceptors(
  promise: Promise<Response>,
  handlers: (RejectedHandler | FulfilledHandler<Response>)[]
): Promise<Response> {
  const length = handlers.length;
  let index = 0;

  while (index < length) {
    const onFulfilled: FulfilledHandler<Response> = handlers[index++];
    const onRejected: RejectedHandler = handlers[index++];
    // https://stackoverflow.com/a/41180264
    // don't separate chains, solution: re-assign then promise
    promise = promise.then(onFulfilled, onRejected);
  }

  return promise;
}
export function isServer() {
  return typeof window === 'undefined';
}
