import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { type Options } from '@mikro-orm/sqlite';
import dotenv from 'dotenv';

dotenv.config();

const config: Options = {
  type: 'sqlite',
  dbName: process.env.DATABASE_NAME ?? 'limehome.db',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.ENV === 'development',
  migrations: {
    tableName: 'migrations',
    path: `${process.env.BASE_DIR}/src/db/migrations`,
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    snapshot: false, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator // migration generator, e.g. to allow custom formatting
  }
};

export default config;
