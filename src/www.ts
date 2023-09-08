import dotenv from 'dotenv';
import { initApp } from './app';
import { type Server } from 'http';
import orm from './db/orm';
import { getLogger } from './logger';

dotenv.config();

const { PORT } = process.env;
let server: Server;

void (async () => {
  server = (await initApp()).listen(PORT, () => {
    getLogger().info(`🥳🥳🥳 Server is running at http://localhost:${PORT}`);
  });
})();

export const shutdown = async (signal: string): Promise<void> => {
  getLogger().info(`Received ${signal}. Shutting down...`);

  await Promise.all([server.close(), orm.instance.close()]);
  process.exit(0);
};
