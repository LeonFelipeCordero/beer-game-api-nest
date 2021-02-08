import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../player/player.entity';
import { PlayerService } from './player.service';
import { PlayerType } from './player.type';

const mockPlayer = new Player(PlayerType.Distributor, 5, 5, 5);

describe('PlayerService', () => {
  let service: PlayerService;
  let repository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: {
            findOneOrFail: jest
              .fn()
              .mockReturnValue(Promise.resolve(mockPlayer)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockPlayer)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockPlayer)),
            create: jest.fn().mockReturnValue(mockPlayer),
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
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    repository = module.get<Repository<Player>>(getRepositoryToken(Player));
  });

  it('should return one order', async () => {
    const player = await service.getOne('id');
    expect(player).toMatchObject(mockPlayer);
    expect(repository.findOneOrFail).toBeCalledTimes(1);
  });

  it('should creater one', async () => {
    const player = await service.insertOne({
      type: PlayerType.Distributor,
      backlog: 5,
      lastOrderResult: 5,
      weeklyOrder: 5,
      gameSessionId: '1',
    });
    expect(player).toMatchObject(mockPlayer);
    expect(repository.save).toBeCalledTimes(1);
  });

  it('should update one', async () => {
    const player = await service.updateOne({
      type: PlayerType.Distributor,
      backlog: 5,
      lastOrderResult: 5,
      weeklyOrder: 5,
      gameSessionId: '1',
    });
    expect(player).toMatchObject(mockPlayer);
    expect(repository.update).toBeCalledTimes(1);
  });
});
