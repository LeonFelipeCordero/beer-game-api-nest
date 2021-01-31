import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { createSession, clearAll } from './e2eBase';
import * as request from 'supertest';

describe('Events (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await clearAll(app);
  });

  it('should create event', async () => {
    const session = await createSession(app);

    const order = await request(app.getHttpServer())
      .post('/order/')
      .send({ quantity: 5, session: session.id, type: 'wholesaler' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.id).not.toBeNull();
        expect(response.body.quantity).toBe(5);
        expect(response.body.quantityDelivered).toBeNull();
        expect(response.body.type).toBe('wholesaler');
        return response.body;
      });

    await request(app.getHttpServer())
      .patch('/order/' + order.id + '/deliver')
      .send({ id: order.id, delivered: true, quantityDelivered: 4 })
      .set('Accept', 'application/json')
      .expect('Content-Type', '/json/')
      .expect(200)
      .then((response) => {
        expect(response.body.delivered).toBe(true);
      });

    setTimeout('', 1000);

    return await request(app.getHttpServer())
      .patch('/retailers/' + session.retailer.id)
      .send({
        id: session.retailer.id,
        weeklyOrder: 10,
        assigned: true,
        backlogInBeers: 15,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.backlogInBeers).toBe(90);
        expect(response.body.lastOrderResult).toBe(5);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
