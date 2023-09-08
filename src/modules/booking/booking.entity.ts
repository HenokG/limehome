import { Entity, ManyToOne, Property, Ref, Reference } from '@mikro-orm/core';
import orm from '../../db/orm';
import { BaseEntity } from '../common/base.entity';
import { calculateCheckOutDate } from '../common/helper';
import { Unit } from '../unit/unit.entity';
import { User } from '../user/user.entity';
import { BookingRepository } from './booking.repository';

@Entity({ repository: () => BookingRepository })
export class Booking extends BaseEntity {
  @Property()
  checkInDate!: Date;

  @Property()
  numberOfNights!: number;

  @ManyToOne(() => Unit)
  unit!: Ref<Unit>;

  @ManyToOne(() => User)
  user!: Ref<User>;

  constructor(checkInDate: Date, numberOfNights: number, unitId: number, userId: number) {
    super();
    this.checkInDate = checkInDate;
    this.numberOfNights = numberOfNights;
    this.unit = Reference.create(orm.em.getReference(Unit, unitId));
    this.user = Reference.create(orm.em.getReference(User, userId));
  }

  @Property({ persist: false })
  get checkOutDate(): Date {
    return calculateCheckOutDate({
      checkInDate: this.checkInDate,
      numberOfNights: this.numberOfNights
    });
  }
}
