import { EntityRepository } from '@mikro-orm/core';
import orm from '../../db/orm';
import { calculateCheckOutDate, isAlreadyBookedForDate } from '../common/helper';
import { Unit } from '../unit/unit.entity';
import { User } from '../user/user.entity';
import { Booking } from './booking.entity';

export class BookingRepository extends EntityRepository<Booking> {
  async getAll(): Promise<Booking[]> {
    return await orm.em.find(Booking, {});
  }

  async findById(id: number): Promise<Booking | null> {
    return await orm.em.findOne(Booking, id);
  }

  async add(booking: Booking): Promise<Booking> {
    await orm.em.persistAndFlush(booking);
    return booking;
  }

  async book({
    checkInDate,
    numberOfNights,
    unitId,
    userId
  }: {
    checkInDate: Date;
    numberOfNights: number;
    unitId: number;
    userId: number;
  }): Promise<Booking | Error> {
    if (numberOfNights < 1) {
      throw new Error('Number of nights must be greater than 0!');
    }
    if (checkInDate.toString() === 'Invalid Date') {
      throw new Error('Invalid check-in date!');
    }
    const user = await orm.em.findOne(
      User,
      { id: userId },
      { populate: ['bookings'], cache: false, refresh: true }
    );
    const unit = await orm.em.findOne(
      Unit,
      { id: unitId },
      { populate: ['bookings'], cache: false, refresh: true }
    );

    if (unit !== null && user !== null && numberOfNights !== 0) {
      const userAlreadyBookedForDate = user.hasAlreadyBookedForDate({
        checkInDate,
        checkOutDate: calculateCheckOutDate({ checkInDate, numberOfNights })
      });

      if (userAlreadyBookedForDate) {
        throw new Error(`User ${user.fullName} already booked for given date!`);
      }

      const isAlreadyBooked = await unit.isBooked({
        checkInDate,
        checkOutDate: calculateCheckOutDate({ checkInDate, numberOfNights }),
        userId
      });

      if (!isAlreadyBooked) {
        const booking = orm.booking.add(new Booking(checkInDate, numberOfNights, unitId, userId));
        return await booking;
      }
      throw new Error('Unit already booked for given date!');
    }

    throw new Error('Invalid input!');
  }

  /**
   * extends the booking by a given number of nights
   *
   * @returns the extended booking or throws an error
   */
  async extendBooking({
    bookingId,
    updatedNumberOfNights
  }: {
    bookingId: number;
    updatedNumberOfNights: number;
  }): Promise<Booking> {
    const currentBooking = await orm.booking.findById(bookingId);
    if (currentBooking === null) {
      throw new Error('Booking not found!');
    }

    if (updatedNumberOfNights <= currentBooking.numberOfNights) {
      throw new Error('Extended number of nights must be greater than current number of nights!');
    }

    const unit = await orm.em.findOne(
      Unit,
      { id: currentBooking.unit.id },
      { populate: ['bookings'], cache: 50, refresh: true }
    );
    if (unit === null) {
      throw new Error('Unit not found!');
    }

    const user = await orm.em.findOne(
      User,
      { id: currentBooking.user.id },
      { populate: ['bookings'], cache: 50, refresh: true }
    );
    if (user === null) {
      throw new Error('User not found!');
    }

    const updatedCheckOutDate = calculateCheckOutDate({
      checkInDate: currentBooking.checkInDate,
      numberOfNights: updatedNumberOfNights
    });

    const unitBookingsWithoutCurrentBooking = unit
      .getBookings()
      .filter((booking) => booking.id !== bookingId);

    const unitIsAlreadyBooked = unitBookingsWithoutCurrentBooking.some((booking) =>
      isAlreadyBookedForDate({
        booking,
        checkInDate: booking.checkInDate,
        checkOutDate: updatedCheckOutDate
      })
    );

    if (unitIsAlreadyBooked) {
      throw new Error('Unit already booked!');
    }

    const userBookingsWithoutCurrentBooking = user
      .getBookings()
      .filter((booking) => booking.id !== bookingId);

    const userAlreadyBookedForDate = userBookingsWithoutCurrentBooking.some((booking) =>
      isAlreadyBookedForDate({
        booking,
        checkInDate: booking.checkInDate,
        checkOutDate: updatedCheckOutDate
      })
    );

    if (userAlreadyBookedForDate) {
      throw new Error('The same guest cannot be in multiple units at the same time!');
    }

    currentBooking.numberOfNights = updatedNumberOfNights;
    await orm.em.flush();
    return currentBooking;
  }

  async delete(id: number): Promise<Booking> {
    const booking = await this.findById(id);
    if (booking === null) {
      throw new Error('Booking not found!');
    }
    await orm.em.removeAndFlush(booking);
    return booking;
  }
}
