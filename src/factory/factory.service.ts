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

  async reduceNormalBacklog() {
    this.logger.log('reducing orders backlog for factories');
    this.findAllOnActiveSession().then((factories) =>
      this.applyOnFactories(factories, this.reduceBacklog, this),
    );
  }

  async releaseProduction() {
    this.logger.log('releaseing factories production');
    this.findAllOnActiveSession().then((factories) =>
      this.applyOnFactories(factories, this.releaseFactoryProduction, this),
    );
  }

  async checkFactoryCapacity() {
    this.findAllOnActiveSession().then((factories) =>
      this.applyOnFactories(factories, this.changeCapacityAllowance, this),
    );
  }

  async increaseCapacity(id: string) {
    return this.getOne(id)
      .then((factory) => {
        factory.increaseInProgress = true;
        return factory;
      })
      .then((factory) => this.factoryRepository.save(factory));
  }

  @OnEvent('order.validate.factory')
  validateOrderDelivering(payload: OrderDeliveredEvent) {
    this.logger.log(`handleing order validatons for order ${payload.id}`);
    this.getOne(payload.sender)
      .then((sender) => this.discountOrderQuantityToSender(sender, payload))
      .then(() => this.eventEmitter.emitReceiveOrderEvent(payload));
  }

  private async findAll(): Promise<Factory[]> {
    return this.factoryRepository.find({ relations: ['gameSession'] });
  }

  private async findAllOnActiveSession(): Promise<Factory[]> {
    return this.findAll().then((factories) =>
      factories.filter((factory) => factory.gameSession.completed),
    );
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

  private async applyOnFactories(
    factories: Factory[],
    apply: (factory: Factory, context: FactoryService) => void,
    context: FactoryService,
  ) {
    factories.forEach((factory) => apply(factory, context));
  }

  private async reduceBacklog(factory: Factory, context: FactoryService) {
    const quantity = (factory.backlogOthers * 10) / 100;
    factory.backlogOthers =
      quantity <= factory.backlogOthers ? quantity : factory.backlogOthers;

    context.factoryRepository.save(factory);
  }

  private async releaseFactoryProduction(
    factory: Factory,
    context: FactoryService,
  ) {
    factory.backlogOthers += factory.weeklyProduction;
    factory.backlogSpecialBeer += factory.weeklySpecialProduction;
    context.factoryRepository.save(factory);
  }

  private async changeCapacityAllowance(
    factory: Factory,
    context: FactoryService,
  ) {
    const capacitySpace =
      factory.fullCapacity -
      (factory.weeklyProduction + factory.weeklySpecialProduction);
    if (capacitySpace <= 100) {
      factory.increaseCapacity = true;
      context.factoryRepository.save(factory);
    }
  }
}
