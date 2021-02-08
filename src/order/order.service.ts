import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Order } from './order.entity';
import { GameSessionService } from '../session/gameSession.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PlayerType } from '../player/player.type';
import { Player } from '../player/player.entity';
import { OrderStatus } from './order.status';
import { OrderDeliveredEvent } from './order.event';
import { OrderDTO } from './order.dto';
import { GameSession } from '../session/gameSession.entity';
import { getParties } from './order.parties';
import { LocalEventEmitter } from '../events/local.events.emitter';

@Injectable()
export class OrderService {
  private logger: Logger;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly gameSessionService: GameSessionService,
    private readonly eventEmitter: LocalEventEmitter,
  ) {
    this.logger = new Logger(OrderService.name);
  }

  async getOne(id: string): Promise<Order> {
    return this.orderRepository.findOneOrFail(id, {
      relations: ['factory', 'receiver', 'sender'],
    });
  }

  async unblockOrders() {
    this.orderRepository
      .find({
        where: {
          status: OrderStatus.OnDelay,
          datetime: LessThan(this.getTimeToUnblock()),
        },
      })
      .then((orders) => this.changeOrdersStatus(orders, OrderStatus.InProgres));
  }

  async insertOne(request: OrderDTO, internal = false): Promise<Order> {
    return this.gameSessionService
      .getOne(request.session)
      .then((gameSession) => this.createOrder(gameSession, internal, request))
      .then((order) => this.orderRepository.save(order));
  }

  async updateOne(request: OrderDTO): Promise<Order> {
    const { id } = request;
    return this.orderRepository
      .update({ id }, request)
      .then(() => this.getOne(id));
  }

  async deliver(request: OrderDTO): Promise<Order> {
    request.status = OrderStatus.InProgres;
    return this.updateOne(request).then((order) => {
      this.eventEmitter.emitValidateOrderEvent(order);
      return order;
    });
  }

  @OnEvent('order.delivered')
  markAsDeliverd(payload: OrderDeliveredEvent) {
    this.getOne(payload.id).then((order) => {
      order.status = OrderStatus.Delivered;
      this.logger.log(
        `Moving order status to ${OrderStatus.Delivered} for order ${payload.id}`,
      );
      return this.orderRepository.save(order);
    });
  }

  private async createOrder(
    gameSession: GameSession,
    internal: boolean,
    request: OrderDTO,
  ): Promise<Order> {
    const order = this.orderRepository.create(request);
    const parties = getParties(request.type.toString());

    if (!internal)
      order.receiver = this.getPlayer(gameSession.players, parties.receiver);

    if (parties.sender === PlayerType.Factory)
      order.factory = gameSession.factory;
    else order.sender = this.getPlayer(gameSession.players, parties.sender);

    order.quantity = this.getPlayer(
      gameSession.players,
      parties.receiver,
    ).weeklyOrder;

    return order;
  }

  private changeOrdersStatus(orders: Order[], status: OrderStatus) {
    orders.forEach((order) => this.changeOrderStatus(order, status));
  }

  private changeOrderStatus(order: Order, status: OrderStatus) {
    this.logger.log(`Moing order ${order.id} to ${status}`);
    order.status = status;
    this.orderRepository.save(order);
  }

  private getPlayer(players: Player[], type: PlayerType): Player {
    return players.find((player) => player.type === type);
  }

  private getTimeToUnblock(): Date {
    const date = new Date();
    date.setSeconds(date.getSeconds() - 30);
    return date;
  }
}
