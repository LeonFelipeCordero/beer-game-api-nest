import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Retailer } from './retailer.entity';
import { RetailerService } from './retailer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameSession } from '../session/gameSession.entity';

const mockRetailer = new Retailer(
  new GameSession('name', '1234', new Date()),
  [],
  5,
  5,
  5,
  '1',
);

describe('game session service', () => {
  let service: RetailerService;
  let repository: Repository<Retailer>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        RetailerService,
        {
          provide: getRepositoryToken(Retailer),
          useValue: {
            findOne: jest.fn().mockReturnValue(Promise.resolve(mockRetailer)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockRetailer)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockRetailer)),
          },
        },
      ],
    }).compile();

    service = app.get<RetailerService>(RetailerService);
    repository = app.get<Repository<Retailer>>(getRepositoryToken(Retailer));
  });

  describe('insertOne', () => {
    it('should create retailer from request', async () => {
      const retailer = await service.insertOne();
      expect(repository.save).toBeCalledTimes(1);
      expect(retailer).toBe(mockRetailer);
    });
  });

  describe('findOne', () => {
    it('should get retailer from database', async () => {
      const foundRetailer = await service.getOne('id');
      expect(foundRetailer).not.toBeNull();
      expect(repository.findOne).toBeCalledTimes(1);
    });
  });

  describe('updateOne', () => {
    it('should update and return new value', async () => {
      await service.updateOne({});
      expect(repository.update).toBeCalledTimes(1);
      expect(repository.findOne).toBeCalledTimes(1);
    });
  });
});
