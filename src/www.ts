import dotenv from 'dotenv';
import { initApp } from './app';
import { Server } from 'http';
import orm from './db/orm';

dotenv.config();

const { PORT } = process.env;
let server: Server;

(async () => {
  server = (await initApp()).listen(PORT, async () => {
    console.log(`🥳🥳🥳 Server is running at http://localhost:${PORT}`);
  });
})();

export const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down...`);

  await Promise.all([server.close(), orm.em.getConnection().close()]);
  process.exit(0);
};
