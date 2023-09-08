import { type NextFunction, type Request, type Response } from 'express';
import pino, { type Logger } from 'pino';

export let logger: Logger;

if (process.env.NODE_ENV === 'production') {
  logger = pino();
} else {
  logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'dd-mm-yyyy HH:MM:ss',
        colorizeObjects: true
      }
    }
  });
}

export const errorLogger = (error: Error, req: Request, res: Response, _: NextFunction): void => {
  logger.error({
    method: req.method,
    uri: req.url,
    error: error.message,
    stack: error.stack
  });
  res.status(500).json({ error: error.message });
};
