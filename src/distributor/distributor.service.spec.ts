import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Distributor } from './distributor.entity';
import { DistributorService } from './distributor.service';
import { GameSession } from '../session/gameSession.entity';

const mockDistributor = new Distributor(
  new GameSession('name', '1234', new Date()),
  [],
  5,
  5,
  5,
  '1',
);

describe('game session service', () => {
  let service: DistributorService;
  let repository: Repository<Distributor>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        DistributorService,
        {
          provide: getRepositoryToken(Distributor),
          useValue: {
            findOne: jest
              .fn()
              .mockReturnValue(Promise.resolve(mockDistributor)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockDistributor)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockDistributor)),
          },
        },
      ],
      imports: [],
    }).compile();

    service = app.get<DistributorService>(DistributorService);
    repository = app.get<Repository<Distributor>>(
      getRepositoryToken(Distributor),
    );
  });

  describe('findOne', () => {
    it('should get distributor from database', async () => {
      const foundDistributor = await service.getOne('1');
      expect(foundDistributor).not.toBeNull();
      expect(repository.findOne).toBeCalledTimes(1);
    });
  });

  describe('updateOne', () => {
    it('should update', async () => {
      await service.updateOne({});
      expect(repository.update).toBeCalledTimes(1);
    });
  });
});
