import { Server } from 'http';
import supertest, { SuperTest } from 'supertest';
import { initApp } from '../../../app';

describe('Test of unit module', () => {
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
    test('should return empty array, 0 units', async () => {
      const { body } = await fetch.get('/unit/list');
      expect(body).toEqual([]);
    });

    test('should return the unit that was just added', async () => {
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const { body } = await fetch.get('/unit/list');
      expect(body).toEqual([expect.objectContaining({ id: unit.id })]);
    });
  });

  describe('POST /add', () => {
    test('should add a unit', async () => {
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      expect(unit).toEqual(expect.objectContaining({ id: expect.any(Number) }));
    });

    test('should add multiple units', async () => {
      const units = await Promise.all([
        fetch.post('/unit/add').send({
          name: 'Unit #1',
          price: 120
        }),
        fetch.post('/unit/add').send({
          name: 'Unit #2',
          price: 120
        }),
        fetch.post('/unit/add').send({
          name: 'Unit #3',
          price: 120
        })
      ]);

      expect(units.map((unit) => unit.body)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Unit #1' }),
          expect.objectContaining({ name: 'Unit #2' }),
          expect.objectContaining({ name: 'Unit #3' })
        ])
      );
    });
  });

  describe('POST /delete', () => {
    test('should return error, if unit does not exist', async () => {
      const { body } = await fetch.post('/unit/delete').send({ id: 1 });

      expect(body).toEqual({
        error: 'Unit not found!'
      });
    });

    test('should delete a booking', async () => {
      const { body: unit } = await fetch.post('/unit/add').send({ name: 'Unit #1', price: 100 });

      const { body: deletedUnit } = await fetch.post('/unit/delete').send({ id: unit.id });

      expect(deletedUnit).toEqual(expect.objectContaining({ id: unit.id, name: 'Unit #1' }));
    });
  });
});
