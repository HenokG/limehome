import {
  Router,
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction
} from 'express';
import { User } from './user.entity';
import orm from '../../db/orm';

const router = Router();

router.post('/add', (async (
  req: Request<null, User, { fullName: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName } = req.body;
    const user = new User(fullName);
    await orm.user.add(user);
    res.json(user);
  } catch (e) {
    next(e);
  }
}) as unknown as RequestHandler);

router.post('/delete', (async (
  req: Request<null, User | null, { id: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const user = await orm.user.delete(id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}) as unknown as RequestHandler);

export { router };
