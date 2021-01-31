import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createSession, clearAll } from './e2eBase';
import { OrderStatus } from '../src/order/order.status';
import { OrderType } from '../src/order/order.type';
import { PlayerType } from '../src/player/player.type';

describe('Order (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await clearAll(app);
  });

  it('create get update an order', async () => {
    const session = await createSession(app);

    const order = await request(app.getHttpServer())
      .post('/order/')
      .send({ session: session.id, type: 'WholesalerOrder' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.id).not.toBeNull();
        expect(response.body.quantity).toBe(5);
        expect(response.body.quantityDelivered).toBeNull();
        expect(response.body.type).toBe(OrderType.WholesalerOrder);
        expect(response.body.sender.type).toBe(PlayerType.Wholesaler);
        expect(response.body.receiver.type).toBe(PlayerType.Retailer);
        return response.body;
      });

    await request(app.getHttpServer())
      .get('/order/' + order.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(order.id);
        expect(response.body.factory).toBeNull();
        expect(response.body.sender.id).toBe(order.sender.id);
        expect(response.body.receiver.id).toBe(order.receiver.id);
      });

    await request(app.getHttpServer())
      .patch('/order/' + order.id)
      .send({
        id: order.id,
        quantity: 10,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.quantity).toBe(10);
        expect(response.body.status).toBe(OrderStatus.OnDelay);
        expect(response.body.quantityDelivered).toBeNull();
        expect(response.body.sender.id).toBe(order.sender.id);
        expect(response.body.receiver.id).toBe(order.receiver.id);
        expect(response.body.factory).toBeNull();
      });

    return await request(app.getHttpServer())
      .patch('/order/' + order.id + '/deliver')
      .send({ id: order.id, status: 'InProgres' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toBe(OrderStatus.InProgres);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
