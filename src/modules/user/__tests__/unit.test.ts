import { type Server } from 'http';
import supertest, { type SuperTest } from 'supertest';
import { initApp } from '../../../app';

describe('Test of user module', () => {
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

  describe('POST /add', () => {
    test('should add a user', async () => {
      const { body: user } = await fetch
        .post('/user/add')
        .send({ fullName: 'Aloy #1', price: 100 });

      expect(user).toEqual(expect.objectContaining({ id: expect.any(Number) }));
    });

    test('should add multiple users', async () => {
      const users = await Promise.all([
        fetch.post('/user/add').send({
          fullName: 'Aloy #1'
        }),
        fetch.post('/user/add').send({
          fullName: 'Aloy #2'
        }),
        fetch.post('/user/add').send({
          fullName: 'Aloy #3'
        })
      ]);

      expect(users.map((user) => user.body)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fullName: 'Aloy #1' }),
          expect.objectContaining({ fullName: 'Aloy #2' }),
          expect.objectContaining({ fullName: 'Aloy #3' })
        ])
      );
    });
  });

  describe('POST /delete', () => {
    test('should return error, if user does not exist', async () => {
      const { body } = await fetch.post('/user/delete').send({ id: 1 });

      expect(body).toEqual({
        error: 'User not found!'
      });
    });

    test('should delete a user', async () => {
      const { body: user } = await fetch
        .post('/user/add')
        .send({ fullName: 'Aloy #1', price: 100 });

      const { body: deletedUser } = await fetch.post('/user/delete').send({ id: user.id });

      expect(deletedUser).toEqual(expect.objectContaining({ id: user.id, fullName: 'Aloy #1' }));
    });
  });
});
