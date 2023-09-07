import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Booking } from '../booking/booking.entity';
import { BaseEntity } from '../common/base.entity';
import { UnitRepository } from './unit.repository';
import { calculateCheckOutDate, isAlreadyBookedForDate } from '../common/helper';

@Entity({ repository: () => UnitRepository })
export class Unit extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  price!: number;

  @OneToMany(() => Booking, (booking) => booking.unit)
  bookings: Booking[] = [];

  constructor(name: string, price: number) {
    super();
    this.name = name;
    this.price = price;
  }

  getBookings(): Booking[] {
    return (this.bookings as unknown as Collection<Booking>).getItems();
  }

  async isBooked({
    checkInDate,
    userId,
    numberOfNights
  }: {
    checkInDate: Date;
    userId: number;
    numberOfNights: number;
  }): Promise<boolean> {
    const checkOutDate = calculateCheckOutDate({ checkInDate, numberOfNights });
    const bookings = this.getBookings();

    return bookings.some(
      (booking) =>
        isAlreadyBookedForDate({ booking, checkInDate, checkOutDate }) || booking.user.id === userId
    );
  }
}
