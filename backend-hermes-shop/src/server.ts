import 'reflect-metadata';
import '~/utils/logging';

import express from 'express';
import env from '~/configs/environment';
import v1Controllers from '~/controllers/v1';
import defineRoutes from '~/core/defineRoutes';

const startServer = () => {
  const app = express();

  app.use(express.json());
  logging('[App] Added middlewares');

  defineRoutes(v1Controllers, app);
  logging('[App] Defined Controller Routing');

  app.listen(env.SERVER_PORT, () => {
    logging(`[App] Server Started, running http://${env.SERVER_HOSTNAME}:${env.SERVER_PORT}`);
  });
};

startServer();
