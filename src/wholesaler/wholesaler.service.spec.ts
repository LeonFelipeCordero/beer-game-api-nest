import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wholesaler } from './wholesaler.entity';
import { WholesalerService } from './wholesaler.service';
import { GameSession } from '../session/gameSession.entity';

const mockWholesaler = new Wholesaler(
  new GameSession('name', '1234', new Date()),
  [],
  5,
  5,
  5,
  '1',
);

describe('game session service', () => {
  let service: WholesalerService;
  let repository: Repository<Wholesaler>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        WholesalerService,
        {
          provide: getRepositoryToken(Wholesaler),
          useValue: {
            findOne: jest.fn().mockReturnValue(Promise.resolve(mockWholesaler)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockWholesaler)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockWholesaler)),
          },
        },
      ],
      imports: [],
    }).compile();

    service = app.get<WholesalerService>(WholesalerService);
    repository = app.get<Repository<Wholesaler>>(
      getRepositoryToken(Wholesaler),
    );
  });

  describe('insertOne', () => {
    it('should create whoelsaer from request', async () => {
      const wholesaler = await service.insertOne();
      expect(wholesaler).toBe(mockWholesaler);
      expect(repository.save).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should get retailer from database', async () => {
      const foundWholesaler = await service.getOne('1');
      expect(foundWholesaler).not.toBeNull();
      expect(repository.findOne).toBeCalledTimes(1);
    });
  });

  describe('updateOne', () => {
    it('should update', async () => {
      await service.updateOne({});
      expect(repository.findOne).toBeCalledTimes(1);
      expect(repository.update).toBeCalledTimes(1);
    });
  });
});
