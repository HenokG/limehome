import { Router, Request } from 'express';
import orm from '../../db/orm';
import { Booking } from './booking.entity';
import { logAndSendError } from '../common/helper';

const router = Router();

router.get('/list', async (_, res) => {
  try {
    const bookings = await orm.booking.getAll();
    res.send(bookings);
  } catch (e) {
    logAndSendError(res, e as Error);
  }
});

router.get('/cleanUp', async (_, res) => {
  try {
    const bookings = await orm.booking.getAll();
    await Promise.all(bookings.map((booking) => orm.em.removeAndFlush(booking)));
    res.send('deleted all bookings');
  } catch (e) {
    logAndSendError(res, e as Error);
  }
});

router.post(
  '/add',
  async (
    req: Request<
      null,
      Booking | Error,
      { checkInDate: string; numberOfNights: number; unitId: number; userId: number }
    >,
    res
  ) => {
    try {
      const { checkInDate, numberOfNights, unitId, userId } = req.body;

      const booking = await orm.booking.book({
        checkInDate: new Date(checkInDate),
        numberOfNights: Number(numberOfNights),
        unitId: Number(unitId),
        userId: Number(userId)
      });

      res.send(booking);
    } catch (e) {
      logAndSendError(res, e as Error);
    }
  }
);

router.post(
  '/extend',
  async (
    req: Request<null, Booking | Error, { updatedNumberOfNights: number; bookingId: number }>,
    res
  ) => {
    try {
      const { updatedNumberOfNights, bookingId } = req.body;

      const updatedBooking = await orm.booking.extendBooking({
        bookingId: Number(bookingId),
        updatedNumberOfNights: Number(updatedNumberOfNights)
      });
      return res.json(updatedBooking);
    } catch (e) {
      logAndSendError(res, e as Error);
    }
  }
);

router.post(
  '/delete',
  async (req: Request<null, Booking | { error: string }, { id: number }>, res) => {
    try {
      const { id } = req.body;
      const booking = await orm.booking.delete(id);

      res.json(booking);
    } catch (e: unknown) {
      logAndSendError(res, e as Error);
    }
  }
);

export { router };
