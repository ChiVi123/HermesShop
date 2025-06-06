import { StatusCodes } from '~/lib/fetchClient/constants';

export interface ResponseError {
  statusCode: StatusCodes;
  message: string;
  stack?: string;
}
