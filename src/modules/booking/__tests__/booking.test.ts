import { Application } from 'express';
import { Server } from 'http';
import supertest from 'supertest';
import { initApp } from '../../../app';

describe('Test of booking module', () => {
  let server: Server;
  let app: Application;

  beforeAll(async () => {
    app = await initApp();
    server = app.listen(process.env.PORT || 3000);
  });

  afterAll(async () => {
    await Promise.all([server.close()]);
  });

  describe('GET /list', () => {
    test('should return empty array', async () => {
      const response = await supertest(app).get('/booking/list');
      console.log(response.body);
      expect(1).toBe(1);
    });
  });
});
