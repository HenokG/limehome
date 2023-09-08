import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import orm, { initDB } from './db/orm';
import { router as registerBookingRoutes } from './modules/booking/routes';
import { router as registerUnitRoutes } from './modules/unit/routes';
import { router as registerUserRoutes } from './modules/user/routes';
import { RequestContext } from '@mikro-orm/core';

export const initApp = async () => {
  const app: Express = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  await initDB();

  app.use((_, __, next) => {
    RequestContext.create(orm.em, next);
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Limehome Backend Challenge');
  });

  app.use('/user', registerUserRoutes);
  app.use('/unit', registerUnitRoutes);
  app.use('/booking', registerBookingRoutes);

  return app;
};
