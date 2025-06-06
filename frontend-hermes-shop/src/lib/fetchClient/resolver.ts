import { StatusCodes } from './constants';
import { FetchClientError } from './FetchClientError';
import { FetchClient, FetchClientResolver } from './types';

type BodyHandler = <V = Response, R = V>(method?: 'json' | undefined | null) => (cb?: (value: V) => R) => Promise<R>;

const HEADER_CONTENT_TYPE = 'content-type';
const CONTENT_TYPE_JSON = 'application/json';
const ERROR_MESSAGE = 'FetchClientError';
const FETCH_ERROR = Symbol();

export function resolver(pathname: string, fetchClient: FetchClient): FetchClientResolver {
  const catchers = new Map(fetchClient.catchers);
  const fetchPromise = fetch(fetchClient.baseUrl + pathname, fetchClient.options);
  const resultFetch = fetchPromise
    .then((res) => {
      if (res.ok) return res;

      return res.text().then((value) => {
        const headerValue = res.headers.get(HEADER_CONTENT_TYPE);
        let json = null;

        if (headerValue && headerValue.includes(CONTENT_TYPE_JSON)) {
          json = JSON.parse(value);
        }

        throw new FetchClientError(ERROR_MESSAGE, res.status, pathname, json);
      });
    })
    .catch((error) => {
      throw { [FETCH_ERROR]: error };
    });

  const catchWrapper = <T>(promise: Promise<T>) =>
    promise.catch((reason) => {
      if (!Object.hasOwn(reason, FETCH_ERROR) || !(reason[FETCH_ERROR] instanceof FetchClientError)) throw reason;

      const error = reason[FETCH_ERROR];
      const catcher = catchers.get(error.status) ?? catchers.get(FETCH_ERROR);
      if (!catcher) throw error;

      return catcher(error, fetchClient);
    });
  const bodyParse: BodyHandler = (method) => (cb) =>
    method
      ? catchWrapper(resultFetch.then((res) => res[method]()).then((value) => (cb ? cb(value) : value)))
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catchWrapper(resultFetch.then((res) => (cb ? cb(res as any) : res)));

  return {
    error(code, callback) {
      catchers.set(code, callback);
      return this;
    },
    badRequest(callback) {
      return this.error(StatusCodes.BAD_REQUEST, callback);
    },
    forbidden(callback) {
      return this.error(StatusCodes.FORBIDDEN, callback);
    },
    internalError(callback) {
      return this.error(StatusCodes.INTERNAL_SERVER_ERROR, callback);
    },
    notFound(callback) {
      return this.error(StatusCodes.NOT_FOUND, callback);
    },
    unauthorized(callback) {
      return this.error(StatusCodes.UNAUTHORIZED, callback);
    },
    fetchError(callback = (err) => err) {
      return this.error(FETCH_ERROR, callback);
    },
    json: bodyParse('json'),
    res: bodyParse(),
  };
}
