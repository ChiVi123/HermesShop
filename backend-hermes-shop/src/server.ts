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
import errorHandlingMiddleware from '~/middlewares/errorHandling';
import routeNotFoundMiddleware from '~/middlewares/routeNotFound';

// config slug charmap
slug.charmap['/'] = '-';

const startServer = () => {
  const app = express();
  // https://stackoverflow.com/questions/22632593/how-to-disable-webpage-caching-in-expressjs-nodejs/53240717#53240717
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  console.log('[App] Disable webpage caching');

  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  console.log('[App] Added middlewares');

  defineRoutes(v1Controllers, app);
  console.log('[App] Defined Controller Routing');

  app.use(routeNotFoundMiddleware);
  app.use(errorHandlingMiddleware);
  console.log('[App] Added error middlewares');

  app.listen(env.LOCAL_SERVER_PORT, () => {
    console.log(`[App] Server Started, running http://${env.LOCAL_SERVER_HOSTNAME}:${env.LOCAL_SERVER_PORT}`);
  });

  AsyncExitHook(() => {
    console.log('[App] Exit');
    closeDB();
  });
};

console.log('[App] Mongodb connecting...');

connectDB()
  .then(() => {
    console.log('[App] Mongodb connected');
  })
  .then(() => {
    startServer();
  })
  .catch((error) => {
    console.log('[App Error]', error);
    process.exit(0);
  });
