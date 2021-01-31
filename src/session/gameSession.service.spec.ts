import { Test, TestingModule } from '@nestjs/testing';
import { GameSessionService } from './gameSession.service';
import { GameSessionRequest } from './model/gameSession.request';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameSession } from './gameSession.entity';
import { Repository } from 'typeorm';
import { Retailer } from '../retailer/retailer.entity';
import { Wholesaler } from '../wholesaler/wholesaler.entity';
import { Distributor } from '../distributor/distributor.entity';
import { Factory } from '../factory/factory.entity';
import { RetailerService } from '../retailer/retailer.service';
import { WholesalerService } from '../wholesaler/wholesaler.service';
import { FactoryService } from '../factory/factory.service';
import { DistributorService } from '../distributor/distributor.service';

const mockSession = new GameSession('session name', '1234', new Date(), '1');

describe('game session service', () => {
  let service: GameSessionService;
  let repository: Repository<GameSession>;
  let retailerService: RetailerService;
  let wholesalerService: WholesalerService;
  let distributorService: DistributorService;
  let factoryService: FactoryService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionService,
        {
          provide: getRepositoryToken(GameSession),
          useValue: {
            findOne: jest.fn().mockReturnValue(mockSession),
            save: jest.fn().mockReturnValue(mockSession),
            find: jest.fn().mockReturnValue([mockSession]),
          },
        },
        {
          provide: 'RetailerService',
          useValue: {
            insertOne: jest
              .fn()
              .mockReturnValue(Promise.resolve(new Retailer())),
          },
        },
        {
          provide: 'WholesalerService',
          useValue: {
            insertOne: jest
              .fn()
              .mockReturnValue(Promise.resolve(new Wholesaler())),
          },
        },
        {
          provide: 'DistributorService',
          useValue: {
            insertOne: jest
              .fn()
              .mockReturnValue(Promise.resolve(new Distributor())),
          },
        },
        {
          provide: 'FactoryService',
          useValue: {
            insertOne: jest
              .fn()
              .mockReturnValue(Promise.resolve(new Factory())),
          },
        },
      ],
    }).compile();

    service = app.get<GameSessionService>(GameSessionService);
    repository = app.get<Repository<GameSession>>(
      getRepositoryToken(GameSession),
    );
    retailerService = app.get<RetailerService>(RetailerService);
    wholesalerService = app.get<WholesalerService>(WholesalerService);
    distributorService = app.get<DistributorService>(DistributorService);
    factoryService = app.get<FactoryService>(FactoryService);
  });

  describe('insertOne', () => {
    it('should create session from request', async () => {
      const session = await service.insertOne(
        new GameSessionRequest('session name', '1234'),
      );
      expect(repository.save).toBeCalledTimes(1);
      expect(retailerService.insertOne).toBeCalledTimes(1);
      expect(wholesalerService.insertOne).toBeCalledTimes(1);
      expect(distributorService.insertOne).toBeCalledTimes(1);
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
      expect(repository.findOne).toBeCalledTimes(1);
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

  describe('should complete session', () => {});
});
