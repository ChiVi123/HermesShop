import { StatusCodes } from './constants';
import { FetchClientError } from './FetchClientError';

export type FetchClientMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type FetchClientOptions = Omit<RequestInit, 'method'>;

type RequestOptions = FetchClientOptions & { params?: Record<string, string | number> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchClientErrorHandler = (error: FetchClientError, original: FetchClient) => any;

export interface FetchClient {
  baseUrl: string;
  options: FetchClientOptions;
  catchers: Map<string | StatusCodes | symbol, FetchClientErrorHandler>;
  request(method: FetchClientMethod, pathname: string, options?: RequestOptions): FetchClientResolver;
  get(pathname: string, options?: RequestOptions): FetchClientResolver;
  post(pathname: string, options?: RequestOptions): FetchClientResolver;
  put(pathname: string, options?: RequestOptions): FetchClientResolver;
  patch(pathname: string, options?: RequestOptions): FetchClientResolver;
  delete(pathname: string, options?: RequestOptions): FetchClientResolver;
}
export interface FetchClientResolver {
  error(code: string | StatusCodes | symbol, callback: FetchClientErrorHandler): this;
  badRequest(callback: FetchClientErrorHandler): this;
  unauthorized(callback: FetchClientErrorHandler): this;
  forbidden(callback: FetchClientErrorHandler): this;
  notFound(callback: FetchClientErrorHandler): this;
  internalError(callback: FetchClientErrorHandler): this;
  fetchError(callback?: FetchClientErrorHandler): this;
  json<V = unknown, R = V>(callback?: (value: V) => R): Promise<R | FetchClientError>;
  res<R = Response>(callback?: (value: Response) => R): Promise<R | FetchClientError>;
}
