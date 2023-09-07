import { EntityRepository } from '@mikro-orm/core';
import orm from '../../db/orm';
import { User } from './user.entity';

export class UserRepository extends EntityRepository<User> {
  async getAll(): Promise<User[]> {
    return orm.em.find(User, {});
  }

  async findById(id: number): Promise<User | null> {
    return orm.em.findOne(User, id);
  }

  async add(user: User): Promise<User> {
    await orm.em.persist(user).flush();
    return user;
  }

  async delete(id: number): Promise<User | null> {
    const user = await this.findOne({ id });
    if (!user) {
      return null;
    }
    await orm.em.remove(user).flush();
    return user;
  }
}
