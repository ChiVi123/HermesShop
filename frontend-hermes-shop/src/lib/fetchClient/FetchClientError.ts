import { ResponseError } from '~/types/responseError';
import { StatusCodes } from './StatusCodes';

export class FetchClientError extends Error {
  public status: StatusCodes;
  public url: string;
  public json?: ResponseError;

  constructor(message: string, code: StatusCodes, url: string, json?: ResponseError) {
    super(message);
    this.status = code;
    this.url = url;
    this.json = json;
  }
}
