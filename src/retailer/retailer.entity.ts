import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameSession } from '../session/gameSession.entity';
import { Order } from '../order/order.entity';

@Entity('retailer')
export class Retailer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 50 })
  backlogInBeers: number;

  @Column({ default: 5 })
  lastOrderResult: number;

  @Column({ default: 5 })
  weeklyOrder: number;

  @Column({ default: false })
  assigned: boolean;

  @OneToOne(() => GameSession, (gameSession) => gameSession.retailer)
  gameSession: GameSession;

  // @OneToMany(() => Order, (order) => order.retailer)
  orders: Order[];

  constructor(
    gameSession?: GameSession,
    orders?: Order[],
    backlogInBeers?: number,
    lastOrderResult?: number,
    weeklyOrder?: number,
    id?: string,
  ) {
    this.gameSession = gameSession;
    this.orders = orders;
    this.backlogInBeers = backlogInBeers;
    this.lastOrderResult = lastOrderResult;
    this.weeklyOrder = weeklyOrder;
    this.id = id;
  }
}
