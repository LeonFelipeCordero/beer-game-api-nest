import { PlayerType } from './player.type';

export const playersInitialInfo = [
  {
    type: PlayerType.Retailer,
    backlog: 100,
    lastOrderResult: 5,
    weeklyOrder: 5,
  },
  {
    type: PlayerType.Wholesaler,
    backlog: 50,
    lastOrderResult: 50,
    weeklyOrder: 50,
  },
  {
    type: PlayerType.Distributor,
    backlog: 150,
    lastOrderResult: 150,
    weeklyOrder: 150,
  },
];
