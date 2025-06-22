import { FetchClient } from './FetchClient';
import { FetchClientError } from './FetchClientError';
import { StatusCodes } from './StatusCodes';

export type FetchClientCodeError = string | symbol | StatusCodes;
export type FetchClientMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type FetchClientOptions = Omit<RequestInit, 'method'>;

export type RequestOptions = FetchClientOptions & { params?: Record<string, string | number>; retry?: boolean };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchClientErrorHandler = (error: FetchClientError, original: FetchClient) => any;

export interface FetchClientResolver {
  error(code: FetchClientCodeError, callback: FetchClientErrorHandler): this;
  badRequest(callback: FetchClientErrorHandler): this;
  unauthorized(callback: FetchClientErrorHandler): this;
  forbidden(callback: FetchClientErrorHandler): this;
  notFound(callback: FetchClientErrorHandler): this;
  gone(callback: FetchClientErrorHandler): this;
  internalServerError(callback: FetchClientErrorHandler): this;
  fetchError(callback?: FetchClientErrorHandler): this;
  json<V = unknown, R = V>(callback?: (value: V) => R): Promise<R | FetchClientError>;
  res<R = Response>(callback?: (value: Response) => R): Promise<R | FetchClientError>;
}

export type FulfilledHandler<T> = (config: T) => T | Promise<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RejectedHandler = (error: any) => any;

export type FetchClientRetry = { baseUrl: string; options: RequestOptions };
