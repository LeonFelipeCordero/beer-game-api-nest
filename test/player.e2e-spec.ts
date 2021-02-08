import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createSession, clearAll } from './e2eBase';

describe('Player (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await clearAll(app);
  });

  it('create find & update players', async () => {
    const session = await createSession(app);

    await request(app.getHttpServer())
      .get('/players/' + session.players[0].id)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(session.players[0].id);
        expect(response.body.gameSession.id).toBe(session.id);
      });

    await request(app.getHttpServer())
      .patch('/players/' + session.players[0].id)
      .send({
        id: session.players[0].id,
        weeklyOrder: 10,
        assigned: true,
        backlog: 150,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.weeklyOrder).toBe(10);
        expect(response.body.backlog).toBe(150);
        expect(response.body.lastOrderResult).toBe(5);
        expect(response.body.assigned).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
