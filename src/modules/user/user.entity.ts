import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Booking } from '../booking/booking.entity';
import { BaseEntity } from '../common/base.entity';
import { isAlreadyBookedForDate } from '../common/helper';
import { UserRepository } from './user.repository';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  @Property()
  fullName!: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings?: Booking[] = [];

  constructor(fullName: string) {
    super();
    this.fullName = fullName;
  }

  getBookings(): Booking[] {
    return (this.bookings as unknown as Collection<Booking>).getItems();
  }

  async hasAlreadyBookedForDate({
    checkInDate,
    checkOutDate
  }: {
    checkInDate: Date;
    checkOutDate: Date;
  }) {
    const bookings = this.getBookings();

    return bookings.some((booking) =>
      isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })
    );
  }
}
