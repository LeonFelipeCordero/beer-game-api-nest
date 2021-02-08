import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Factory } from '../factory/factory.entity';
import { OrderStatus } from './order.status';
import { OrderType } from './order.type';
import { Player } from '../player/player.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  quantityDelivered?: number;

  @Column({ default: OrderStatus.OnDelay, type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  datetime: Date;

  @ManyToOne(() => Factory, (factory) => factory.orders)
  factory?: Factory;

  @ManyToOne(() => Player, (player) => player.sendingOrders)
  sender?: Player;

  @ManyToOne(() => Player, (player) => player.receivingOrders)
  receiver?: Player;

  constructor(
    quantity: number,
    quantityDelivered?: number,
    status?: OrderStatus,
    type?: OrderType,
    id?: string,
    factory?: Factory,
    sender?: Player,
    receiver?: Player,
  ) {
    this.quantity = quantity;
    this.quantityDelivered = quantityDelivered;
    this.status = status;
    this.type = type;
    this.id = id;
    this.factory = factory;
    this.sender = sender;
    this.receiver = receiver;
  }
}
