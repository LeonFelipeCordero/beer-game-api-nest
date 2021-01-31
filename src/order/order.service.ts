import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderDTO } from './order.dto';
import { GameSessionService } from '../session/gameSession.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderType } from './order.type';
import { PlayerType } from '../player/player.type';
import { Player } from '../player/player.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly gameSessionService: GameSessionService,
    private readonly eventEmiter: EventEmitter2,
  ) {}

  async getOne(id: string): Promise<Order> {
    return this.orderRepository.findOne(id, {
      relations: ['factory', 'receiver', 'sender'],
    });
  }

  async insertOne(request: OrderDTO, internal = false): Promise<Order> {
    return this.gameSessionService
      .getOne(request.session)
      .then((gameSession) => {
        const order = this.orderRepository.create(request);
        const parties = this.getParties(request.type.toString());
        if (!internal)
          order.receiver = this.getPlayer(
            gameSession.players,
            parties.receiver,
          );
        if (parties.sender === PlayerType.Factory)
          order.factory = gameSession.factory;
        else order.sender = this.getPlayer(gameSession.players, parties.sender);
        order.quantity = this.getPlayer(
          gameSession.players,
          parties.receiver,
        ).weeklyOrder;
        return order;
      })
      .then((order) => this.orderRepository.save(order));
  }

  async updateOne(request: OrderDTO, deliver = false): Promise<Order> {
    const { id } = request;
    return this.orderRepository
      .update({ id }, request)
      .then(() => this.getOne(id));
    // .then((order) => {
    // if (deliver) {
    // const parties = this.getParties(request.type);
    // this.eventEmiter.emit(`order.${order.type}.validate`, {
    //   id: order.id,
    //   quantity: order.quantityDelivered,
    //   receiver: order[parties.receiver],
    //   creator: order[parties.creator],
    // });
    // }
    // return order;
    // });
  }

  private getPlayer(players: Player[], type: PlayerType): Player {
    return players.find((player) => player.type === type);
  }

  private getParties(orderType: string): any {
    switch (orderType) {
      case OrderType.RetailerOrder:
        return this.createParties(PlayerType.Retailer, PlayerType.Retailer);
      case OrderType.WholesalerOrder:
        return this.createParties(PlayerType.Wholesaler, PlayerType.Retailer);
      case OrderType.DistributorOrder:
        return this.createParties(
          PlayerType.Distributor,
          PlayerType.Wholesaler,
        );
      case OrderType.FactoryOrder:
        return this.createParties(PlayerType.Factory, PlayerType.Distributor);
      default:
        throw new NotAcceptableException(`Order type ${orderType} not valid`);
    }
  }

  private createParties(sender: PlayerType, receiver: PlayerType): any {
    return {
      sender: sender,
      receiver: receiver,
    };
  }
}
