import { cloneDeep, merge } from 'lodash';
import { CONTENT_TYPE_JSON, ERROR_MESSAGE, FETCH_ERROR, HEADER_CONTENT_TYPE } from './constants';
import { FetchClientError } from './FetchClientError';
import { FetchClientResolver, fetchClientResolver } from './fetchClientResolver';
import { InterceptorManager } from './InterceptorManager';
import {
  FetchClientCodeError,
  FetchClientErrorHandler,
  FetchClientMethod,
  FetchClientRetry,
  RequestOptions,
} from './types';
import { handleRequestInterceptors } from './utils';

type Interceptors<T> = {
  request: InterceptorManager<T>;
  response: InterceptorManager<Response>;
};

export class FetchClient {
  private _baseUrl: string;
  private _options: RequestOptions;
  private _interceptors: Interceptors<RequestOptions>;
  private _catchers: Map<FetchClientCodeError, FetchClientErrorHandler>;

  constructor(value: FetchClient, options?: RequestOptions, method?: FetchClientMethod);
  constructor(value: string, options?: RequestOptions);
  constructor(value: FetchClient | string, options?: RequestOptions, method?: FetchClientMethod) {
    if (value instanceof FetchClient) {
      this._baseUrl = value._baseUrl;
      this._options = merge({ method }, value._options, options);
      this._interceptors = cloneDeep(value._interceptors);
      this._catchers = new Map(value._catchers);
    } else {
      this._baseUrl = value ?? '';
      this._options = options ?? {};
      this._interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager(),
      };
      this._catchers = new Map();
    }
  }

  public get baseUrl(): string {
    return this._baseUrl;
  }

  public set baseUrl(v: string) {
    this._baseUrl = v;
  }

  public get options(): RequestOptions {
    return this._options;
  }

  public get catchers(): Map<FetchClientCodeError, FetchClientErrorHandler> {
    return this._catchers;
  }

  public get interceptors(): Interceptors<RequestOptions> {
    return this._interceptors;
  }

  public setCookie(cookies: string): FetchClient {
    const headers = new Headers(this.options.headers);
    headers.set('Cookie', cookies);
    merge(this.options, { headers });
    return this;
  }

  public get(pathname: string, options?: RequestOptions): FetchClientResolver {
    return this.request('GET', pathname, options);
  }

  public post(pathname: string, options?: RequestOptions): FetchClientResolver {
    return this.request('POST', pathname, options);
  }

  public put(pathname: string, options?: RequestOptions): FetchClientResolver {
    return this.request('PUT', pathname, options);
  }

  public patch(pathname: string, options?: RequestOptions): FetchClientResolver {
    return this.request('PATCH', pathname, options);
  }

  public delete(pathname: string, options?: RequestOptions): FetchClientResolver {
    return this.request('DELETE', pathname, options);
  }

  public retry(pathname: string, clientRetry: FetchClientRetry) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.request((clientRetry.options as any).method, pathname, clientRetry.options);
  }

  private request(method: FetchClientMethod, pathname: string, options?: RequestOptions): FetchClientResolver {
    const fetchClientCloned = new FetchClient(this, options, method);
    const responsePromise = handleRequestInterceptors(
      fetchClientCloned.options,
      fetchClientCloned._interceptors.request.handlers
    )
      .then((config) => this.fetching(fetchClientCloned.baseUrl, pathname, config))
      .catch((error) => {
        throw { [FETCH_ERROR]: error };
      });

    fetchClientResolver.fetchClient = fetchClientCloned;
    fetchClientResolver.response = responsePromise;

    return fetchClientResolver;
  }

  private async fetching(baseUrl: string, pathname: string, options: RequestOptions) {
    const res = await fetch(baseUrl + pathname, options);
    if (res.ok) return res;

    const value = await res.text();
    const headerValue = res.headers.get(HEADER_CONTENT_TYPE);
    let json = null;
    if (headerValue && headerValue.includes(CONTENT_TYPE_JSON)) {
      json = JSON.parse(value);
    }
    throw new FetchClientError(ERROR_MESSAGE, res.status, pathname, { baseUrl, options }, json);
  }
}
