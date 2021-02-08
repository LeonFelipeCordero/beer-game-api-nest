import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderStatus } from './order.status';
import { GameSession } from '../session/gameSession.entity';
import { PlayerType } from '../player/player.type';
import { Factory } from '../factory/factory.entity';
import { Player } from '../player/player.entity';
import { OrderType } from './order.type';
import { LocalEventEmitter } from '../events/local.events.emitter';

const mockOrder = new Order(
  5,
  5,
  OrderStatus.Pending,
  OrderType.DistributorOrder,
  '1',
);
const mockSession = new GameSession(
  'session name',
  '1234',
  new Date(),
  '1',
  new Factory(),
  [
    new Player(PlayerType.Wholesaler, 5, 5, 5),
    new Player(PlayerType.Distributor, 5, 5, 5),
  ],
);

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;
  let localEmitter: LocalEventEmitter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            findOneOrFail: jest
              .fn()
              .mockReturnValue(Promise.resolve(mockOrder)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockOrder)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockOrder)),
            create: jest.fn().mockReturnValue(mockOrder),
          },
        },
        {
          provide: 'GameSessionService',
          useValue: {
            getOne: jest.fn().mockReturnValue(Promise.resolve(mockSession)),
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

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
    localEmitter = module.get<LocalEventEmitter>(LocalEventEmitter);
  });

  it('should return one order', async () => {
    const order = await service.getOne('id');
    expect(order).toMatchObject(mockOrder);
    expect(repository.findOneOrFail).toBeCalledTimes(1);
  });

  it('should creater one', async () => {
    const order = await service.insertOne({ type: OrderType.DistributorOrder });
    expect(order).toMatchObject(mockOrder);
    expect(repository.save).toBeCalledTimes(1);
  });

  it('should update one', async () => {
    const order = await service.updateOne({ id: '1' });
    expect(order).toMatchObject(mockOrder);
    expect(repository.update).toBeCalledTimes(1);
  });

  it('should update one and emit event', async () => {
    jest.spyOn(localEmitter, 'emitValidateOrderEvent');
    const order = await service.deliver({ type: OrderType.DistributorOrder });
    expect(order).toMatchObject(mockOrder);
    expect(repository.update).toBeCalledTimes(1);
    expect(localEmitter.emitValidateOrderEvent).toBeCalledTimes(1);
  });
});
