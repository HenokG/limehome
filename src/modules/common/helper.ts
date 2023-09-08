import { type Response } from 'express';
import { type Booking } from '../booking/booking.entity';
import { getLogger } from '../../logger';

export const handleError = (res: Response, error: Error): void => {
  getLogger().error(error);
  res.status(400).json({ error: error.message });
};

/**
 * calculates the check out date based on the check in date and the number of nights
 * @example
 * ```
 * const checkInDate = new Date('2021-01-01');
 * const numberOfNights = 3;
 * const checkOutDate = calculateCheckOutDate({ checkInDate, numberOfNights });
 * console.log(checkOutDate); // 2021-01-04
 * ```
 *
 * @returns the check out date
 */
export const calculateCheckOutDate = ({
  checkInDate,
  numberOfNights
}: {
  checkInDate: Date;
  numberOfNights: number;
}): Date => {
  if (numberOfNights < 1) throw new Error('Number of nights must be greater than 0');
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkOutDate.getDate() + Number(numberOfNights));
  return checkOutDate;
};

/**
 * checks if a booking is already in a given date range
 * @example
 * ```
 * const booking = {
 *  checkInDate: new Date('2021-01-01'),
 *  checkOutDate: new Date('2021-01-04')
 * };
 * const checkInDate = new Date('2021-01-02');
 * const checkOutDate = new Date('2021-01-03');
 * const isAlreadyBooked = isAlreadyBookedForDate({ booking, checkInDate, checkOutDate });
 * console.log(isAlreadyBooked); // true
 * ```
 *
 */
export const isAlreadyBookedForDate = ({
  booking,
  checkInDate,
  checkOutDate
}: {
  booking: Booking;
  checkInDate: Date;
  checkOutDate: Date;
}): boolean =>
  (booking.checkInDate.getTime() < checkOutDate.getTime() &&
    booking.checkOutDate.getTime() > checkInDate.getTime()) ||
  booking.checkInDate.getTime() === checkInDate.getTime() ||
  booking.checkOutDate.getTime() === checkOutDate.getTime();
