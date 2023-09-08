import { Router, type Request, type Response, type RequestHandler } from 'express';
import orm from '../../db/orm';
import { Unit } from './unit.entity';
import { handleError } from '../common/helper';

const router = Router();

router.get('/list', (async (_: Request, res: Response) => {
  try {
    const units = await orm.unit.getAll();
    res.json(units);
  } catch (e) {
    handleError(res, e as Error);
  }
}) as unknown as RequestHandler);

router.post('/add', (async (
  req: Request<null, Unit, { name: string; price: number }>,
  res: Response
) => {
  try {
    const { name, price } = req.body;
    const unit = new Unit(name, price);
    await orm.unit.add(unit);
    res.json(unit);
  } catch (e) {
    handleError(res, e as Error);
  }
}) as unknown as RequestHandler);

router.post('/delete', (async (req: Request<null, Unit | null, { id: number }>, res: Response) => {
  try {
    const { id } = req.body;
    const unit = await orm.unit.delete(id);
    res.json(unit);
  } catch (e) {
    handleError(res, e as Error);
  }
}) as unknown as RequestHandler);

export { router };
