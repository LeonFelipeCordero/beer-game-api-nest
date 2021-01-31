import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { GameSession } from '../session/gameSession.entity';
import { Order } from '../order/order.entity';

@Entity('distributor')
export class Distributor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 150 })
  backlogInCrates: number;

  @Column({ default: 150 })
  lastOrderResult: number;

  @Column({ default: 150 })
  weeklyOrder: number;

  @Column({ default: false })
  assigned: boolean;

  @OneToOne(() => GameSession, (gameSession) => gameSession.distributor)
  gameSession: GameSession;

  // @OneToMany(() => Order, (order) => order.distributor)
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
