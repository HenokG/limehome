import { EntityRepository } from '@mikro-orm/core';
import orm from '../../db/orm';
import { Unit } from './unit.entity';

export class UnitRepository extends EntityRepository<Unit> {
  async getAll(): Promise<Unit[]> {
    return orm.em.find(Unit, {});
  }

  async findById(id: number): Promise<Unit | null> {
    return orm.em.findOne(Unit, id);
  }

  async add(unit: Unit): Promise<Unit> {
    await orm.em.persistAndFlush(unit);
    return unit;
  }

  async delete(id: number): Promise<Unit> {
    const unit = await this.findOne({ id });
    if (!unit) {
      throw new Error('Unit not found!');
    }
    await orm.em.removeAndFlush(unit);
    return unit;
  }
}
