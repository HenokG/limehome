import {
  Router,
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction
} from 'express';
import orm from '../../db/orm';
import { type Booking } from './booking.entity';

const router = Router();

router.get('/list', (async (_: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await orm.booking.getAll();
    res.json(bookings);
  } catch (e) {
    next(e);
  }
}) as unknown as RequestHandler);

router.post('/add', (async (
  req: Request<
    null,
    Booking | Error,
    { checkInDate: string; numberOfNights: number; unitId: number; userId: number }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { checkInDate, numberOfNights, unitId, userId } = req.body;

    const booking = await orm.booking.book({
      checkInDate: new Date(checkInDate),
      numberOfNights: Number(numberOfNights),
      unitId: Number(unitId),
      userId: Number(userId)
    });

    res.json(booking);
  } catch (e) {
    next(e);
  }
}) as unknown as RequestHandler);

router.post('/extend', (async (
  req: Request<null, Booking | Error, { updatedNumberOfNights: number; bookingId: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { updatedNumberOfNights, bookingId } = req.body;

    const updatedBooking = await orm.booking.extendBooking({
      bookingId: Number(bookingId),
      updatedNumberOfNights: Number(updatedNumberOfNights)
    });
    return res.json(updatedBooking);
  } catch (e) {
    next(e);
  }
}) as unknown as RequestHandler);

router.post('/delete', (async (
  req: Request<null, Booking | { error: string }, { id: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const booking = await orm.booking.delete(id);

    res.json(booking);
  } catch (e) {
    next(e);
  }
}) as unknown as RequestHandler);

export { router };
