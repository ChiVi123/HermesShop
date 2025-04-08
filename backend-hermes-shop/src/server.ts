import 'reflect-metadata';
import '~/types/globals';
import '~/utils/logging';

import AsyncExitHook from 'async-exit-hook';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { corsOptions } from '~/configs/cors';
import env from '~/configs/environment';
import v1Controllers from '~/controllers/v1';
import defineRoutes from '~/core/defineRoutes';
import { closeDB, connectDB } from '~/core/mongodb';

const startServer = () => {
  const app = express();
  // https://stackoverflow.com/questions/22632593/how-to-disable-webpage-caching-in-expressjs-nodejs/53240717#53240717
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  logging('[App] Disable webpage caching');

  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  logging('[App] Added middlewares');

  defineRoutes(v1Controllers, app);
  logging('[App] Defined Controller Routing');

  app.listen(env.LOCAL_SERVER_PORT, () => {
    logging(`[App] Server Started, running http://${env.LOCAL_SERVER_HOSTNAME}:${env.LOCAL_SERVER_PORT}`);
  });

  AsyncExitHook(() => {
    logging('[App] Exit');
    closeDB();
  });
};

logging('[App] Mongodb connecting...');

connectDB()
  .then(() => {
    logging('[App] Mongodb connected');
  })
  .then(() => {
    startServer();
  })
  .catch((error) => {
    logging('[App Error]', error);
    process.exit(0);
  });
