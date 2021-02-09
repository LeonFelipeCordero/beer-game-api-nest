import { LocalEventEmitter } from './local.events.emitter';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Order } from '../order/order.entity';
import { OrderStatus } from '../order/order.status';
import { OrderType } from '../order/order.type';
import { Player } from '../player/player.entity';
import { PlayerType } from '../player/player.type';

describe('should emit events', () => {
  let localEmitter: LocalEventEmitter;
  let eventEmiter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalEventEmitter,
        {
          provide: 'EventEmitter2',
          useValue: {
            emmit: jest.fn().mockReturnValue(true),
          },
        },
      ],
      imports: [EventEmitterModule.forRoot()],
    }).compile();

    localEmitter = module.get<LocalEventEmitter>(LocalEventEmitter);
    eventEmiter = module.get<EventEmitter2>(EventEmitter2);
  });

  test('should emit validate order event', () => {
    const order = new Order(
      1,
      1,
      OrderStatus.Pending,
      OrderType.RetailerOrder,
      '1',
      null,
      new Player(PlayerType.Retailer, 1, 1, 1, null, [], [], '1'),
      new Player(PlayerType.Wholesaler, 1, 1, 1, null, [], [], '2'),
    );
    jest.spyOn(eventEmiter, 'emit');
    localEmitter.emitValidateOrderEvent(order);
    expect(eventEmiter.emit).toBeCalledTimes(1);
  });

  test('should emit receive order event', () => {
    jest.spyOn(eventEmiter, 'emit');
    localEmitter.emitReceiveOrderEvent({});
    expect(eventEmiter.emit).toBeCalledTimes(1);
  });

  test('should emit validate delivered order event', () => {
    jest.spyOn(eventEmiter, 'emit');
    localEmitter.emitDeliveredOrder({});
    expect(eventEmiter.emit).toBeCalledTimes(1);
  });
});
