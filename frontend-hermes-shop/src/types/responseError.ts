import { StatusCodes } from '~/lib/fetchClient/StatusCodes';

export interface ResponseError {
  statusCode: StatusCodes;
  message: string;
  stack?: string;
}
