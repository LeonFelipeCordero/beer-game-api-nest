import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatus } from './order.status';

const mockOrder = new Order(5, 5, OrderStatus.Pending, '1');

describe('OrderService', () => {
  let service: OrderService;
  let repository: Repository<Order>;
  let eventEmiter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            findOne: jest.fn().mockReturnValue(Promise.resolve(mockOrder)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockOrder)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockOrder)),
            create: jest.fn().mockReturnValue(mockOrder),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
    eventEmiter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should return one order', () => {
    const order = service.getOne('id');
    expect(order).toMatchObject(mockOrder);
    expect(repository.findOne).toBeCalledTimes(1);
  });

  it('should creater one', () => {
    const order = service.insertOne({});
    expect(order).toMatchObject(mockOrder);
    expect(repository.save).toBeCalledTimes(1);
  });

  it('should update one', () => {
    const order = service.updateOne({});
    expect(order).toMatchObject(mockOrder);
    expect(repository.update).toBeCalledTimes(1);
    expect(repository.create).toBeCalledTimes(1);
  });

  it('should update one and emit event', () => {
    jest.spyOn(eventEmiter, 'emit');
    const order = service.updateOne({}, true);
    expect(order).toMatchObject(mockOrder);
    expect(repository.update).toBeCalledTimes(1);
    expect(repository.create).toBeCalledTimes(1);
    expect(eventEmiter.emit).toBeCalledTimes(1);
  });
});
