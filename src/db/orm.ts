import { MikroORM, type EntityManager } from '@mikro-orm/sqlite';
import { Booking } from '../modules/booking/booking.entity';
import { type BookingRepository } from '../modules/booking/booking.repository';
import { Unit } from '../modules/unit/unit.entity';
import { type UnitRepository } from '../modules/unit/unit.repository';
import { User } from '../modules/user/user.entity';
import { type UserRepository } from '../modules/user/user.repository';
import dbConfig from './mikro-orm.config';

interface Orm {
  instance: MikroORM;
  em: EntityManager;
  user: UserRepository;
  unit: UnitRepository;
  booking: BookingRepository;
}

const orm: Orm = {} as unknown as Orm;

export const initDB = async (): Promise<void> => {
  const ormInstance = await MikroORM.init(dbConfig);

  await ormInstance.getMigrator().up();

  orm.instance = ormInstance;
  orm.em = ormInstance.em;
  orm.user = ormInstance.em.getRepository(User);
  orm.unit = ormInstance.em.getRepository(Unit);
  orm.booking = ormInstance.em.getRepository(Booking);
};

export default orm;
