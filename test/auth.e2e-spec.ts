import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { createSession, clearAll } from './e2eBase';
import * as request from 'supertest';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await clearAll(app);
  });

  it('should to login successfuly and fail', async () => {
    const session = await createSession(app);
    await request(app.getHttpServer())
      .post('/auth/login/')
      .send({ username: 'session name', password: '1234' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body.id).toBe(session.id);
      });
    return await request(app.getHttpServer())
      .post('/auth/login/')
      .send({ username: 'session name', password: '12345' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
