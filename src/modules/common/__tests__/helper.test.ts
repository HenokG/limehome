import { Booking } from '../../booking/booking.entity';
import { calculateCheckOutDate, isAlreadyBookedForDate } from '../helper';

describe.only('Test of common module', () => {
  describe('calculateCheckOutDate', () => {
    test('should return check out date', () => {
      const checkInDate = new Date('2021-01-01');
      const numberOfNights = 6;
      const checkOutDate = calculateCheckOutDate({ checkInDate, numberOfNights });
      expect(checkOutDate).toEqual(new Date('2021-01-07'));
    });

    test('should throw error when numberOfNights is negative', () => {
      const checkInDate = new Date('2021-01-01');
      const numberOfNights = -1;
      expect(() => calculateCheckOutDate({ checkInDate, numberOfNights })).toThrow(
        'Number of nights must be greater than 0'
      );
    });
  });

  describe('isAlreadyBookedForDate', () => {
    test('should return true when booking is already booked for date, date range in between booking', () => {
      const booking = {
        checkInDate: new Date('2021-01-01'),
        checkOutDate: new Date('2021-01-07')
      } as Booking;
      const checkInDate = new Date('2021-01-02');
      const checkOutDate = new Date('2021-01-03');
      expect(isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })).toEqual(true);
    });

    test('should return true when booking is already booked for date, date range is same as booking', () => {
      const booking = {
        checkInDate: new Date('2021-01-01'),
        checkOutDate: new Date('2021-01-07')
      } as Booking;
      const checkInDate = new Date('2021-01-01');
      const checkOutDate = new Date('2021-01-07');
      expect(isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })).toEqual(true);
    });

    test('should return true when booking is already booked for date, date range has same check in date', () => {
      const booking = {
        checkInDate: new Date('2021-01-01'),
        checkOutDate: new Date('2021-01-07')
      } as Booking;
      const checkInDate = new Date('2021-01-01');
      const checkOutDate = new Date('2021-01-02');
      expect(isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })).toEqual(true);
    });

    test('should return true when booking is already booked for date, date range has same checkout date', () => {
      const booking = {
        checkInDate: new Date('2021-01-01'),
        checkOutDate: new Date('2021-01-07')
      } as Booking;
      const checkInDate = new Date('2021-01-06');
      const checkOutDate = new Date('2021-01-07');
      expect(isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })).toEqual(true);
    });

    test('should return false when booking is not booked for date', () => {
      const booking = {
        checkInDate: new Date('2021-01-01'),
        checkOutDate: new Date('2021-01-07')
      } as Booking;
      const checkInDate = new Date('2021-01-08');
      const checkOutDate = new Date('2021-01-09');
      expect(isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })).toEqual(false);
    });

    test('should return false when booking is not booked for date, date range is checked out on booking check in date', () => {
      const booking = {
        checkInDate: new Date('2021-01-01'),
        checkOutDate: new Date('2021-01-07')
      } as Booking;
      const checkInDate = new Date('2020-12-31');
      const checkOutDate = new Date('2021-01-01');
      expect(isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })).toEqual(false);
    });

    test('should return false when booking is not booked for date, date range is checked in on booking check out date', () => {
      const booking = {
        checkInDate: new Date('2021-01-01'),
        checkOutDate: new Date('2021-01-07')
      } as Booking;
      const checkInDate = new Date('2021-01-07');
      const checkOutDate = new Date('2021-01-08');
      expect(isAlreadyBookedForDate({ booking, checkInDate, checkOutDate })).toEqual(false);
    });
  });
});
