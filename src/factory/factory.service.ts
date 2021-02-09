import { Injectable, Logger } from '@nestjs/common';
import { Factory } from './factory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactoryDTO } from './factory.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderDeliveredEvent } from 'src/order/order.event';
import { LocalEventEmitter } from '../events/local.events.emitter';

@Injectable()
export class FactoryService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
    private readonly eventEmitter: LocalEventEmitter,
  ) {
    this.logger = new Logger(FactoryService.name);
  }

  async getOne(id: string): Promise<Factory> {
    return this.factoryRepository.findOneOrFail(id, {
      relations: ['gameSession', 'orders'],
    });
  }

  async insertOne(): Promise<Factory> {
    return this.factoryRepository.save(new Factory());
  }

  async updateOne(factory: FactoryDTO): Promise<Factory> {
    const { id } = factory;
    return this.factoryRepository
      .update({ id }, factory)
      .then(() => this.getOne(id));
  }

  @OnEvent('order.validate.factory')
  validateOrderDelivering(payload: OrderDeliveredEvent) {
    this.logger.log(`handleing order validatons for order ${payload.id}`);
    this.getOne(payload.sender)
      .then((sender) => this.discountOrderQuantityToSender(sender, payload))
      .then(() => this.eventEmitter.emitReceiveOrderEvent(payload));
  }

  private async discountOrderQuantityToSender(
    factory: Factory,
    payload: OrderDeliveredEvent,
  ) {
    const deliveredQuantity =
      factory.backlogSpecialBeer >= payload.quantity
        ? payload.quantity
        : factory.backlogSpecialBeer;

    factory.backlogSpecialBeer -= deliveredQuantity;
    payload.quantity = deliveredQuantity;

    this.logger.log(
      `factory ${factory.id} delivering ${deliveredQuantity} crates`,
    );

    return this.factoryRepository.save(factory);
  }
}
