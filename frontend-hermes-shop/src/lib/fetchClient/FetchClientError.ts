import { ResponseError } from '~/types/responseError';
import { StatusCodes } from './StatusCodes';
import { FetchClientRetry } from './types';

export class FetchClientError extends Error {
  public status: StatusCodes;
  public url: string;
  public retryConfig: FetchClientRetry;
  public json?: ResponseError;

  constructor(message: string, code: StatusCodes, url: string, retry: FetchClientRetry, json?: ResponseError) {
    super(message);
    this.status = code;
    this.url = url;
    this.retryConfig = retry;
    this.json = json;
  }
}
