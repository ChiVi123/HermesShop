import { FETCH_ERROR } from './constants';
import { FetchClient } from './FetchClient';
import { FetchClientError } from './FetchClientError';
import { StatusCodes } from './StatusCodes';
import { FetchClientCodeError, FetchClientErrorHandler } from './types';
import { handleResponseInterceptors } from './utils';

const MESSAGE_FETCH_CLIENT_ERROR = 'fetchClient object is not set!!!';
const MESSAGE_RESPONSE_ERROR = 'Response is not set!!!';

export class FetchClientResolver {
  private _fetchClient: FetchClient | undefined;
  private _responsePromise: Promise<Response> | undefined;

  public set fetchClient(fetchClient: FetchClient) {
    this._fetchClient = fetchClient;
  }

  public set response(responsePromise: Promise<Response>) {
    const promise = responsePromise.then((res) => {
      if (!this._fetchClient) throw Error(MESSAGE_RESPONSE_ERROR);
      return handleResponseInterceptors(res, this._fetchClient?.interceptors.response.handlers);
    });

    this._responsePromise = promise;
  }

  public badRequest(callback: FetchClientErrorHandler): this {
    return this.error(StatusCodes.BAD_REQUEST, callback);
  }

  public unauthorized(callback: FetchClientErrorHandler): this {
    return this.error(StatusCodes.UNAUTHORIZED, callback);
  }

  public forbidden(callback: FetchClientErrorHandler): this {
    return this.error(StatusCodes.FORBIDDEN, callback);
  }

  public notFound(callback: FetchClientErrorHandler): this {
    return this.error(StatusCodes.NOT_FOUND, callback);
  }

  public gone(callback: FetchClientErrorHandler): this {
    return this.error(StatusCodes.GONE, callback);
  }

  public internalServerError(callback: FetchClientErrorHandler): this {
    return this.error(StatusCodes.INTERNAL_SERVER_ERROR, callback);
  }

  public fetchError(callback: FetchClientErrorHandler = (err) => err): this {
    return this.error(FETCH_ERROR, callback);
  }

  public json<V = unknown, R = V>(callback?: (value: V) => R): Promise<FetchClientError | V | R> {
    if (!this._responsePromise) throw Error(MESSAGE_FETCH_CLIENT_ERROR);
    return this.catchWrapper(
      this._responsePromise.then<V>((res) => res.json()).then((value) => (callback ? callback(value) : value))
    );
  }

  public res<R = Response>(callback?: (value: Response) => R): Promise<FetchClientError | Response | R> {
    if (!this._responsePromise) throw Error(MESSAGE_FETCH_CLIENT_ERROR);
    return this.catchWrapper(this._responsePromise.then((value) => (callback ? callback(value) : value)));
  }

  private error(code: FetchClientCodeError, callback: FetchClientErrorHandler): this {
    if (!this._fetchClient) throw Error(MESSAGE_RESPONSE_ERROR);
    this._fetchClient.catchers.set(code, callback);

    return this;
  }

  private async catchWrapper<T>(promise: Promise<T>): Promise<T | FetchClientError> {
    try {
      return await promise;
    } catch (reason) {
      if (!this._fetchClient) throw Error(MESSAGE_RESPONSE_ERROR);
      if (!reason || typeof reason !== 'object') throw reason;
      if (!(FETCH_ERROR in reason) || !(reason[FETCH_ERROR] instanceof FetchClientError)) throw reason;

      const error = reason[FETCH_ERROR];
      const catcher = this._fetchClient.catchers.get(error.status) ?? this._fetchClient.catchers.get(FETCH_ERROR);
      if (!catcher) throw error;
      return catcher(error, this._fetchClient);
    }
  }
}

export const fetchClientResolver = new FetchClientResolver();
