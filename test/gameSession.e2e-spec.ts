import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { createSession, clearAll, getSession } from './e2eBase';

describe('GameSession (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await clearAll(app);
  });

  it('create get', async () => {
    const session = await createSession(app);
    return await getSession(app, session.id).then((foundSession) => {
      expect(session.id).toBe(foundSession.id);
      expect(session.name).toBe(foundSession.name);
      expect(session.password).toBe(foundSession.password);
      expect(session.active).toBe(foundSession.active);
      expect(session.completed).toBe(foundSession.completed);
      expect(session.finished).toBe(foundSession.finished);
      // expect(session.retailer).not.toBeNull();
      // expect(session.wholesaler).not.toBeNull();
      // expect(session.distributor).not.toBeNull();
      expect(session.players).not.toBeNull();
      expect(session.players).not.toBe([]);
      expect(session.players.length).toBe(3);
      expect(session.factory).not.toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
