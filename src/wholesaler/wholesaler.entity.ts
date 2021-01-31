import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { GameSession } from '../session/gameSession.entity';
import { Order } from '../order/order.entity';

@Entity('wholesaler')
export class Wholesaler {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 50 })
  backlogInCrates: number;

  @Column({ default: 50 })
  lastOrderResult: number;

  @Column({ default: 50 })
  weeklyOrder: number;

  @Column({ default: false })
  assigned: boolean;

  @OneToOne(() => GameSession, (gameSession) => gameSession.wholesaler)
  gameSession: GameSession;

  // @OneToMany(() => Order, (order) => order.wholesaler)
  orders: Order[];

  constructor(
    gameSession?: GameSession,
    orders?: Order[],
    backlogInCrates?: number,
    lastOrderResult?: number,
    weeklyOrder?: number,
    id?: string,
  ) {
    this.gameSession = gameSession;
    this.orders = orders;
    this.backlogInCrates = backlogInCrates;
    this.lastOrderResult = lastOrderResult;
    this.weeklyOrder = weeklyOrder;
    this.id = id;
  }
}
