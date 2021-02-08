import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order } from '../order/order.entity';
import { getParties } from '../order/order.parties';
import { PlayerType } from '../player/player.type';

@Injectable()
export class LocalEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitValidateOrderEvent(order: Order) {
    const parties = getParties(order.type.toString());

    this.eventEmitter.emit('order.validate', {
      id: order.id,
      quantity: order.quantity,
      receiver: order.receiver.id,
      sender:
        parties.sender === PlayerType.Factory
          ? order.factory.id
          : order.sender.id,
      type: order.type,
    });
  }

  emitDeliveredOrder(payload: any) {
    this.eventEmitter.emit(`order.delivered`, payload);
  }
}
