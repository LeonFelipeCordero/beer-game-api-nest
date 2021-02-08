import { OrderType } from './order.type';

export interface OrderDeliveredEvent {
  id: string;
  quantity: number;
  type: OrderType;
  receiver: string;
  sender: string;
}
