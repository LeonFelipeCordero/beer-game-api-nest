import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Factory } from './factory.entity';
import { FactoryService } from './factory.service';
import { GameSession } from '../session/gameSession.entity';

const mockFactory = new Factory(
  new GameSession('name', '1234', new Date()),
  [],
  5,
  5,
  5,
  '1',
);

describe('game session service', () => {
  let service: FactoryService;
  let repository: Repository<Factory>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FactoryService,
        {
          provide: getRepositoryToken(Factory),
          useValue: {
            findOneOrFail: jest
              .fn()
              .mockReturnValue(Promise.resolve(mockFactory)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockFactory)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockFactory)),
          },
        },
        {
          provide: 'LocalEventEmitter',
          useValue: {
            emitValidateOrderEvent: () => {
              return 1;
            },
          },
        },
      ],
      imports: [],
    }).compile();

    service = app.get<FactoryService>(FactoryService);
    repository = app.get<Repository<Factory>>(getRepositoryToken(Factory));
  });

  describe('findOne', () => {
    it('should get factory from database', async () => {
      const foundFactory = await service.getOne('1');
      expect(foundFactory).not.toBeNull();
      expect(repository.findOneOrFail).toBeCalledTimes(1);
    });
  });
  describe('updateOne', () => {
    it('should update', async () => {
      await service.updateOne({});
      expect(repository.findOneOrFail).toBeCalledTimes(1);
      expect(repository.update).toBeCalledTimes(1);
    });
  });
});
