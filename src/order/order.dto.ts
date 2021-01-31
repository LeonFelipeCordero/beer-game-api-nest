import { OrderStatus } from './order.status';
import { OrderType } from './order.type';

export interface OrderDTO {
  id?: string;
  quantity?: number;
  quantityDelivered?: number;
  status?: OrderStatus;
  type?: OrderType;
  session?: string;
}
