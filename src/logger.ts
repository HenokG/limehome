import pino, { type Logger } from 'pino';

let customLogger: Logger;

export const getLogger = (): Logger => {
  if (customLogger !== undefined) return customLogger;

  if (process.env.NODE_ENV === 'production') {
    customLogger = pino();
  } else {
    customLogger = pino({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    });
  }
  return customLogger;
};
