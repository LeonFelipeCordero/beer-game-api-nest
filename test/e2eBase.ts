import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Factory } from '../src/factory/factory.entity';
import { GameSession } from '../src/session/gameSession.entity';
import { Order } from '../src/order/order.entity';
import { Player } from '../src/player/player.entity';

export const clearAll = async (app: INestApplication) => {
  const orderRepository = app.get<Repository<Order>>(getRepositoryToken(Order));
  await orderRepository.delete({});

  const playerRepository = app.get<Repository<Player>>(
    getRepositoryToken(Player),
  );
  await playerRepository.delete({});

  const sessionRepository = app.get<Repository<GameSession>>(
    getRepositoryToken(GameSession),
  );
  await sessionRepository.delete({});

  const factoryRepository = app.get<Repository<Factory>>(
    getRepositoryToken(Factory),
  );
  await factoryRepository.delete({});
};

export const createSession = async (app: INestApplication) =>
  await request(app.getHttpServer())
    .post('/game-sessions')
    .send({ name: 'session name', password: '1234' })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(201)
    .then((response) => response.body);

export const getSession = async (app, session: string) =>
  await request(app.getHttpServer())
    .get('/game-sessions/' + session)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .then((response) => response.body);
