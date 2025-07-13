import 'reflect-metadata';
import '~/types/globals';
import '~/utils/logging';

import AsyncExitHook from 'async-exit-hook';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import slug from 'slug';
import { corsOptions } from '~/configs/cors';
import env from '~/configs/environment';
import v1Controllers from '~/controllers/v1';
import defineRoutes from '~/core/defineRoutes';
import { closeDB, connectDB } from '~/core/mongodb';
import errorHandlingMiddleware from '~/middlewares/errorHandlingMiddleware';
import routeNotFoundMiddleware from '~/middlewares/routeNotFoundMiddleware';
import { PREFIX_APP_ERROR_LOG, PREFIX_APP_LOG } from './utils/constants';

// config slug charmap
slug.charmap['/'] = '-';

const startServer = () => {
  const app = express();
  // https://stackoverflow.com/questions/22632593/how-to-disable-webpage-caching-in-expressjs-nodejs/53240717#53240717
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  logging.info(`${PREFIX_APP_LOG} Disable webpage caching`);

  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  logging.info(`${PREFIX_APP_LOG} Added middlewares`);

  defineRoutes(v1Controllers, app);
  logging.info(`${PREFIX_APP_LOG} Defined Controller Routing`);

  app.use(routeNotFoundMiddleware);
  app.use(errorHandlingMiddleware);
  logging.info(`${PREFIX_APP_LOG} Added error middlewares`);

  app.listen(env.LOCAL_SERVER_PORT, () => {
    logging.info(
      `${PREFIX_APP_LOG} Server Started, running http://${env.LOCAL_SERVER_HOSTNAME}:${env.LOCAL_SERVER_PORT}`,
    );
  });

  AsyncExitHook(async (hook) => {
    logging.info(`${PREFIX_APP_LOG} Exit`);
    await closeDB();
    hook();
  });
};

logging.info(`${PREFIX_APP_LOG} Mongodb connecting...`);

connectDB()
  .then(() => {
    logging.info(`${PREFIX_APP_LOG} Mongodb connected`);
  })
  .then(() => {
    startServer();
  })
  .catch((error) => {
    logging.info(PREFIX_APP_ERROR_LOG, error);
    process.exit(0);
  });
