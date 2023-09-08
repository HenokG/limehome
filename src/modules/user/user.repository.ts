import { EntityRepository } from '@mikro-orm/core';
import orm from '../../db/orm';
import { User } from './user.entity';

export class UserRepository extends EntityRepository<User> {
  async findById(id: number): Promise<User | null> {
    return await orm.em.findOne(User, id);
  }

  async add(user: User): Promise<User> {
    await orm.em.persistAndFlush(user);
    return user;
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOne({ id });
    if (user == null) {
      throw new Error('User not found!');
    }
    await orm.em.removeAndFlush(user);
    return user;
  }
}
