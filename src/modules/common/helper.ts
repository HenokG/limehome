import { type Response } from 'express';
import { type Booking } from '../booking/booking.entity';

export const logAndSendError = (res: Response, error: Error): void => {
  console.error(error);
  res.status(400).json({ error: error.message });
};

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
