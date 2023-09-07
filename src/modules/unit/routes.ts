import { Router, Request } from 'express';
import orm from '../../db/orm';
import { Unit } from './unit.entity';
import { logAndSendError } from '../common/helper';

const router = Router();

router.get('/list', async (_, res) => {
  try {
    const units = await orm.unit.getAll();
    res.send(units);
  } catch (e) {
    logAndSendError(res, e as Error);
  }
});

router.post('/add', async (req: Request<null, Unit, { name: string; price: number }>, res) => {
  try {
    const { name, price } = req.body;
    const unit = new Unit(name, price);
    await orm.unit.add(unit);
    res.send(unit);
  } catch (e) {
    logAndSendError(res, e as Error);
  }
});

router.post('/delete', async (req: Request<null, Unit | null, { id: number }>, res) => {
  try {
    const { id } = req.body;
    const unit = await orm.unit.delete(id);
    res.send(unit);
  } catch (e) {
    logAndSendError(res, e as Error);
  }
});

export { router };
