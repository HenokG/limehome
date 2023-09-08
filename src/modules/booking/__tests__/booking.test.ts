import { Server } from 'http';
import moment from 'moment';
import supertest, { SuperTest } from 'supertest';
import { initApp } from '../../../app';

describe('Test of booking module', () => {
  let server: Server;
  let fetch: SuperTest<any>;

  beforeAll(async () => {
    const app = await initApp();
    server = app.listen(process.env.PORT ?? 3000);
    fetch = supertest(app);
  });

  afterAll(async () => {
    await Promise.all([server.close()]);
  });

  describe('GET /list', () => {
    test('should return empty array, 0 bookings', async () => {
      const { body } = await fetch.get('/booking/list');
      expect(body).toEqual([]);
    });

    test('should return the booking that was just made', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const checkInDate = moment().toISOString();

      const { body: booking } = await fetch.post('/booking/add').send({
        checkInDate,
        numberOfNights: 6,
        unitId: unit.id,
        userId: user.id
      });

      const { body } = await fetch.get('/booking/list');
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: booking.id
          })
        ])
      );
    });

    test('should return all bookings', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      await Promise.all([
        fetch.post('/booking/add').send({
          checkInDate: moment().toISOString(),
          numberOfNights: 6,
          unitId: unit.id,
          userId: user.id
        }),
        fetch.post('/booking/add').send({
          checkInDate: moment().add(6, 'days').toISOString(),
          numberOfNights: 6,
          unitId: unit.id,
          userId: user.id
        }),
        fetch.post('/booking/add').send({
          checkInDate: moment().add(12, 'days').toISOString(),
          numberOfNights: 6,
          unitId: unit.id,
          userId: user.id
        })
      ]);

      const { body } = await fetch.get('/booking/list');
      expect(body.length).toEqual(3);
    });
  });

  describe('POST /add', () => {
    test('should add a booking', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const { body: booking } = await fetch.post('/booking/add').send({
        checkInDate: moment().toISOString(),
        numberOfNights: 6,
        unitId: unit.id,
        userId: user.id
      });

      expect(booking).toEqual(expect.objectContaining({ id: expect.any(Number) }));
    });

    test('should add multiple bookings', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const bookings = await Promise.all([
        fetch.post('/booking/add').send({
          checkInDate: moment().toISOString(),
          numberOfNights: 6,
          unitId: unit.id,
          userId: user.id
        }),
        fetch.post('/booking/add').send({
          checkInDate: moment().add(6, 'days').toISOString(),
          numberOfNights: 7,
          unitId: unit.id,
          userId: user.id
        }),
        fetch.post('/booking/add').send({
          checkInDate: moment().add(13, 'days').toISOString(),
          numberOfNights: 8,
          unitId: unit.id,
          userId: user.id
        })
      ]);

      expect(bookings.map((booking) => booking.body)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ numberOfNights: 6 }),
          expect.objectContaining({ numberOfNights: 7 }),
          expect.objectContaining({ numberOfNights: 8 })
        ])
      );
    });
  });

  describe('POST /extend', () => {
    test('should return error, if booking does not exist', async () => {
      const { body } = await fetch.post('/booking/extend').send({
        bookingId: 1,
        updatedNumberOfNights: 8
      });

      expect(body).toEqual({
        error: 'Booking not found!'
      });
    });

    test('should return error, if number of nights is less than 1', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const { body: booking } = await fetch.post('/booking/add').send({
        checkInDate: moment().toISOString(),
        numberOfNights: 6,
        unitId: unit.id,
        userId: user.id
      });

      const { body } = await fetch.post('/booking/extend').send({
        bookingId: booking.id,
        updatedNumberOfNights: 0
      });

      expect(body).toEqual({
        error: 'Extended number of nights must be greater than current number of nights!'
      });
    });

    test('should extend booking for user', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const { body: booking } = await fetch.post('/booking/add').send({
        checkInDate: moment().toISOString(),
        numberOfNights: 6,
        unitId: unit.id,
        userId: user.id
      });

      const { body: updatedBooking } = await fetch.post('/booking/extend').send({
        bookingId: booking.id,
        updatedNumberOfNights: 8
      });

      expect(updatedBooking).toEqual(
        expect.objectContaining({ id: booking.id, numberOfNights: 8 })
      );
    });

    test('should return error, if user has already booked another unit at the same time', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit1 } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });
      const { body: unit2 } = await fetch.post('/unit/add').send({ name: 'Unit #2', price: 230 });

      const { body: booking1 } = await fetch.post('/booking/add').send({
        checkInDate: moment().toISOString(),
        numberOfNights: 6,
        unitId: unit1.id,
        userId: user.id
      });

      await fetch.post('/booking/add').send({
        checkInDate: moment().add(6, 'days').toISOString(),
        numberOfNights: 2,
        unitId: unit2.id,
        userId: user.id
      });

      const { body } = await fetch.post('/booking/extend').send({
        bookingId: booking1.id,
        updatedNumberOfNights: 7
      });

      expect(body).toEqual({
        error: 'The same guest cannot be in multiple units at the same time!'
      });
    });

    test('should return error, if unit is already booked by another user', async () => {
      const { body: user1 } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: user2 } = await fetch.post('/user/add').send({ fullName: 'Sylens' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const { body: booking1 } = await fetch.post('/booking/add').send({
        checkInDate: moment().toISOString(),
        numberOfNights: 6,
        unitId: unit.id,
        userId: user1.id
      });

      await fetch.post('/booking/add').send({
        checkInDate: moment().add(8, 'days').toISOString(),
        numberOfNights: 10,
        unitId: unit.id,
        userId: user2.id
      });

      const { body } = await fetch.post('/booking/extend').send({
        bookingId: booking1.id,
        updatedNumberOfNights: 9
      });

      expect(body).toEqual({
        error: 'Unit already booked!'
      });
    });
  });

  describe('POST /delete', () => {
    test('should return error, if booking does not exist', async () => {
      const { body } = await fetch.post('/booking/delete').send({ id: 1 });

      expect(body).toEqual({
        error: 'Booking not found!'
      });
    });

    test('should delete a booking', async () => {
      const { body: user } = await fetch.post('/user/add').send({ fullName: 'Aloy' });
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const { body: booking } = await fetch.post('/booking/add').send({
        checkInDate: moment().toISOString(),
        numberOfNights: 6,
        unitId: unit.id,
        userId: user.id
      });

      const { body: deletedBooking } = await fetch.post('/booking/delete').send({ id: booking.id });

      expect(deletedBooking).toEqual(
        expect.objectContaining({ id: booking.id, numberOfNights: 6 })
      );
    });
  });
});
