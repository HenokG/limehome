import fs from 'fs';
import orm from '../src/db/orm';

beforeEach(async () => {
  await orm.instance?.getSchemaGenerator().refreshDatabase();
});

afterAll(async () => {
  await orm.instance?.close(); // close database connection
  fs.rmSync(process.env.BASE_DIR ?? './test/tmp', { recursive: true, force: true }); // remove temporary test directory
  fs.rmSync(process.env.DATABASE_NAME ?? 'limehome.test.db', { force: true }); // remove temporary test database
});
