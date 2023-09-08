import dotenv from 'dotenv';
import { initApp } from './app';
import { type Server } from 'http';
import orm from './db/orm';

dotenv.config();

const { PORT } = process.env;
let server: Server;

void (async () => {
  server = (await initApp()).listen(PORT, () => {
    console.log(`🥳🥳🥳 Server is running at http://localhost:${PORT}`);
  });
})();

export const shutdown = async (signal: string): Promise<void> => {
  console.log(`Received ${signal}. Shutting down...`);

  await Promise.all([server.close(), orm.em.getConnection().close()]);
  process.exit(0);
};
