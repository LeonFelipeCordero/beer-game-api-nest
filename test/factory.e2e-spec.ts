import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createSession, clearAll } from './e2eBase';

describe('Factory (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await clearAll(app);
  });

  it('create get update factory & create get update order', async () => {
    const session = await createSession(app);

    await request(app.getHttpServer())
      .get('/factories/' + session.factory.id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(session.factory.id);
        expect(response.body.gameSession.id).toBe(session.id);
      });

    await request(app.getHttpServer())
      .patch('/factories/' + session.factory.id)
      .send({
        id: session.factory.id,
        fullCapacity: 10,
        weeklyProduction: 10,
        weeklySpecialProduction: 10,
        assigned: true,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.fullCapacity).toBe(10);
        expect(response.body.backlogSpecialBeer).toBe(500);
        expect(response.body.backlogOthers).toBe(2500);
        expect(response.body.weeklyProduction).toBe(10);
        expect(response.body.weeklySpecialProduction).toBe(10);
        expect(response.body.assigned).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
