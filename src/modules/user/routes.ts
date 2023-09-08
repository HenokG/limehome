import { Router, Request } from 'express';
import { User } from './user.entity';
import orm from '../../db/orm';
import { logAndSendError } from '../common/helper';

const router = Router();

router.post('/add', async (req: Request<null, User, { fullName: string }>, res) => {
  try {
    const { fullName } = req.body;
    const user = new User(fullName);
    await orm.user.add(user);
    res.send(user);
  } catch (e) {
    logAndSendError(res, e as Error);
  }
});

router.post('/delete', async (req: Request<null, User | null, { id: number }>, res) => {
  try {
    const { id } = req.body;
    const user = await orm.user.delete(id);
    res.send(user);
  } catch (e) {
    logAndSendError(res, e as Error);
  }
});

export { router };
