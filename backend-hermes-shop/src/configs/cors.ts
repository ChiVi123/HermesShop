import type { CorsOptions } from 'cors';
import NextError from '~/helpers/nextError';
import env from './environment';
import { StatusCodes } from './statusCode';

const generateRegexPath = (pathName: string) => new RegExp(`/v1/${pathName}/?(.+)`);

export const securityPathConfig: RegExp[] = [generateRegexPath('users')];
export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (requestOrigin === undefined || env.SERVER_ORIGIN_WHITELIST.includes(requestOrigin)) {
      return callback(null, true);
    }

    return callback(new NextError(StatusCodes.FORBIDDEN, `${requestOrigin} not allowed by our CORS Policy.`));
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
