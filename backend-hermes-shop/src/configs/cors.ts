import type { CorsOptions } from 'cors';
import type { Express } from 'express';
import env from '~/configs/environment';
import { StatusCodes } from '~/configs/statusCodes';
import NextError from '~/helpers/nextError';

const generateRegexPath = (pathName: string) => new RegExp(`/v1/${pathName}/?(.+)`);

const USER_PATH = generateRegexPath('users');
const PRODUCT_PATH = generateRegexPath('products');
const CATEGORY_PATH = generateRegexPath('categories');

export const securityPathMap: Map<keyof Express, RegExp[]> = new Map();
securityPathMap.set('get', [USER_PATH]);
securityPathMap.set('post', [PRODUCT_PATH, CATEGORY_PATH]);
securityPathMap.set('put', [PRODUCT_PATH, CATEGORY_PATH]);
securityPathMap.set('patch', [PRODUCT_PATH]);
securityPathMap.set('delete', [PRODUCT_PATH]);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (origin === undefined || env.SERVER_ORIGIN_WHITELIST.includes(origin)) {
      return callback(null, true);
    }

    return callback(new NextError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`));
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
