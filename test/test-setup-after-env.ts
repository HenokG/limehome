import fs from 'fs';
import orm from '../src/db/orm';

afterAll(async () => {
  await orm.em.getConnection().close();
  fs.rmSync(process.env.BASE_DIR || './tmp', { recursive: true, force: true }); // remove temporary test directory
  fs.rmSync(process.env.DATABASE_NAME || 'limehome.test.db', { force: true }); // remove temporary test database
});
