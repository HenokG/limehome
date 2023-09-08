import { type EntityManager, MikroORM, type Options } from '@mikro-orm/sqlite';
import { type UserRepository } from '../modules/user/user.repository';
import { type UnitRepository } from '../modules/unit/unit.repository';
import { Unit } from '../modules/unit/unit.entity';
import { User } from '../modules/user/user.entity';
import { Booking } from '../modules/booking/booking.entity';
import { type BookingRepository } from '../modules/booking/booking.repository';
import { TSMigrationGenerator } from '@mikro-orm/migrations';

interface Orm {
  instance: MikroORM;
  em: EntityManager;
  user: UserRepository;
  unit: UnitRepository;
  booking: BookingRepository;
}

const orm: Orm = {} as unknown as Orm;

export const getOptions = (): Options => ({
  type: 'sqlite',
  dbName: process.env.DATABASE_NAME ?? 'limehome.db',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.DEVELOPMENT === 'true',
  migrations: {
    tableName: 'migrations',
    path: `${process.env.BASE_DIR}/migrations`,
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    snapshot: true, // save snapshot when creating new migrations
    emit: 'ts', // migration generation mode
    generator: TSMigrationGenerator // migration generator, e.g. to allow custom formatting
  }
});

export const initDB = async (): Promise<void> => {
  const ormInstance = await MikroORM.init(getOptions());

  const migrator = ormInstance.getMigrator();
  await migrator.createMigration();
  await migrator.up();

  orm.instance = ormInstance;
  orm.em = ormInstance.em;
  orm.user = ormInstance.em.getRepository(User);
  orm.unit = ormInstance.em.getRepository(Unit);
  orm.booking = ormInstance.em.getRepository(Booking);
};

export default orm;
