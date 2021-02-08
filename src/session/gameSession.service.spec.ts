import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionService } from './gameSession.service';
import { GameSessionRequest } from './model/gameSession.request';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameSession } from './gameSession.entity';
import { Repository } from 'typeorm';
import { FactoryService } from '../factory/factory.service';
import { Player } from '../player/player.entity';
import { PlayerType } from '../player/player.type';
import { Factory } from '../factory/factory.entity';
import { PlayerService } from '../player/player.service';

const mockSession = new GameSession('session name', '1234', new Date(), '1');
const mockPlayer = new Player(PlayerType.Distributor, 5, 5, 5);
const mockFactory = new Factory();

describe('game session service', () => {
  let service: GameSessionService;
  let repository: Repository<GameSession>;
  let factoryService: FactoryService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionService,
        {
          provide: getRepositoryToken(GameSession),
          useValue: {
            findOneOrFail: jest.fn().mockReturnValue(mockSession),
            findOne: jest.fn().mockReturnValue(mockSession),
            save: jest.fn().mockReturnValue(mockSession),
            find: jest.fn().mockReturnValue([mockSession]),
          },
        },
        {
          provide: 'PlayerService',
          useValue: {
            insertOne: jest.fn().mockReturnValue(Promise.resolve(mockPlayer)),
            insertMany: jest
              .fn()
              .mockReturnValue([
                Promise.resolve(mockPlayer),
                Promise.resolve(mockPlayer),
                Promise.resolve(mockPlayer),
              ]),
          },
        },
        {
          provide: 'FactoryService',
          useValue: {
            insertOne: jest
              .fn()
              .mockReturnValue(Promise.resolve(Promise.resolve(mockFactory))),
          },
        },
      ],
    }).compile();

    service = app.get<GameSessionService>(GameSessionService);
    repository = app.get<Repository<GameSession>>(
      getRepositoryToken(GameSession),
    );
    playerService = app.get<PlayerService>(PlayerService);
    factoryService = app.get<FactoryService>(FactoryService);
  });

  describe('insertOne', () => {
    it('should create session from request', async () => {
      const session = await service.insertOne(
        new GameSessionRequest('session name', '1234'),
      );
      expect(repository.save).toBeCalledTimes(1);
      expect(playerService.insertMany).toBeCalledTimes(1);
      expect(factoryService.insertOne).toBeCalledTimes(1);

      expect(session).toBe(mockSession);
    });
  });

  describe('findOne', () => {
    it('should get session from database', async () => {
      const session = await service.insertOne(
        new GameSessionRequest('session name', '1234'),
      );

      const foundSession = await service.getOne(session.id);
      expect(foundSession).not.toBeNull();
      expect(foundSession.id).toBe(session.id);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.findOneOrFail).toBeCalledTimes(1);
    });
  });

  describe('findOneByName', () => {
    it('should get session from database', async () => {
      const session = await service.insertOne(
        new GameSessionRequest('session name', '1234'),
      );

      const foundSession = await service.getOneByName(session.name);
      expect(foundSession).not.toBeNull();
      expect(foundSession.id).toBe(session.id);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledTimes(1);
    });
  });

  // describe('should complete session', () => {});
});
