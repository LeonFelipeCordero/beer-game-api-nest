import { OrderType } from './order.type';
import { PlayerType } from '../player/player.type';
import { NotAcceptableException } from '@nestjs/common';

export function getParties(orderType: string): any {
  switch (orderType) {
    case OrderType.RetailerOrder:
      return createParties(PlayerType.Retailer, PlayerType.Retailer);
    case OrderType.WholesalerOrder:
      return createParties(PlayerType.Wholesaler, PlayerType.Retailer);
    case OrderType.DistributorOrder:
      return createParties(PlayerType.Distributor, PlayerType.Wholesaler);
    case OrderType.FactoryOrder:
      return createParties(PlayerType.Factory, PlayerType.Distributor);
    default:
      throw new NotAcceptableException(`Order type ${orderType} not valid`);
  }
}

function createParties(sender: PlayerType, receiver: PlayerType): any {
  return {
    sender: sender,
    receiver: receiver,
  };
}
