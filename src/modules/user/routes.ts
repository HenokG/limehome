import { Router, type Request, type Response, type RequestHandler } from 'express';
import { User } from './user.entity';
import orm from '../../db/orm';
import { handleError } from '../common/helper';

const router = Router();

router.post('/add', (async (req: Request<null, User, { fullName: string }>, res: Response) => {
  try {
    const { fullName } = req.body;
    const user = new User(fullName);
    await orm.user.add(user);
    res.json(user);
  } catch (e) {
    handleError(res, e as Error);
  }
}) as unknown as RequestHandler);

router.post('/delete', (async (req: Request<null, User | null, { id: number }>, res: Response) => {
  try {
    const { id } = req.body;
    const user = await orm.user.delete(id);
    res.json(user);
  } catch (e) {
    handleError(res, e as Error);
  }
}) as unknown as RequestHandler);

export { router };
