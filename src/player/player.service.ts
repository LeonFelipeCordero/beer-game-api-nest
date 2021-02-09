import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { PlayerDTO } from './player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderDeliveredEvent } from '../order/order.event';
import { LocalEventEmitter } from '../events/local.events.emitter';

@Injectable()
export class PlayerService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly eventEmitter: LocalEventEmitter,
  ) {
    this.logger = new Logger(PlayerService.name);
  }

  async getOne(id: string): Promise<Player> {
    return this.playerRepository.findOneOrFail(id, {
      relations: ['gameSession', 'receivingOrders', 'sendingOrders'],
    });
  }

  async insertOne(request: PlayerDTO): Promise<Player> {
    const newPlayer = this.playerRepository.create(request);
    return this.playerRepository.save(newPlayer);
  }

  async insertMany(requests: PlayerDTO[]): Promise<Player[]> {
    const newPlayers = this.playerRepository.create(requests);
    return this.playerRepository.save(newPlayers);
  }

  async updateOne(request: PlayerDTO): Promise<Player> {
    const { id } = request;
    return this.playerRepository
      .update({ id }, request)
      .then(() => this.getOne(id));
  }

  @OnEvent('order.validate.player')
  validateOrderDelivering(payload: OrderDeliveredEvent) {
    this.logger.log(`handleing order validatons for order ${payload.id}`);
    this.getOne(payload.sender)
      .then((sender) => this.discountOrderQuantityToSender(sender, payload))
      .then(() => this.eventEmitter.emitReceiveOrderEvent(payload));
  }

  @OnEvent('order.receive')
  receiveOrder(payload: OrderDeliveredEvent) {
    this.logger.log(`receiving order after validation for order ${payload.id}`);
    if (payload.receiver != null)
      this.getOne(payload.receiver)
        .then((receiver) =>
          this.increaseOrderQuantityToReceiver(receiver, payload),
        )
        .then(() => this.eventEmitter.emitDeliveredOrder(payload));
    else this.eventEmitter.emitDeliveredOrder(payload);
  }

  private async discountOrderQuantityToSender(
    sender: Player,
    payload: OrderDeliveredEvent,
  ) {
    const deliveredQuantity =
      sender.backlog >= payload.quantity ? payload.quantity : sender.backlog;

    sender.backlog -= deliveredQuantity;
    payload.quantity = deliveredQuantity;

    this.logger.log(
      `player ${sender.id} delivering ${deliveredQuantity} crates`,
    );

    return this.playerRepository.save(sender);
  }

  private async increaseOrderQuantityToReceiver(
    receiver: Player,
    payload: OrderDeliveredEvent,
  ) {
    receiver.backlog +=
      payload.type === 'WholesalerOrder'
        ? payload.quantity * 10
        : payload.quantity;

    receiver.lastOrderResult = payload.quantity;

    this.logger.log(
      `player ${receiver.id} recieving ${payload.quantity} crates`,
    );

    return this.playerRepository.save(receiver);
  }
}
