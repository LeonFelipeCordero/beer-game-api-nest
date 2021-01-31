import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { GameSession } from '../session/gameSession.entity';
import { PlayerType } from './player.type';

@Entity('player')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PlayerType })
  type: PlayerType;

  @Column()
  backlog: number;

  @Column()
  lastOrderResult: number;

  @Column()
  weeklyOrder: number;

  @Column({ default: false })
  assigned: boolean;

  @ManyToOne(() => GameSession, (gameSession) => gameSession.retailer)
  gameSession: GameSession;

  @OneToMany(() => Order, (order) => order.sender)
  outgoingOrders: Order[];

  @OneToMany(() => Order, (order) => order.receiver)
  incomingOrders: Order[];

  constructor(
    backlog: number,
    weeklyOrder: number,
    lastOrderResult: number,
    gameSession?: GameSession,
    outgoingOrders?: Order[],
    incomingOrders?: Order[],
    id?: string,
  ) {
    this.gameSession = gameSession;
    this.outgoingOrders = outgoingOrders;
    this.incomingOrders = incomingOrders;
    this.backlog = backlog;
    this.lastOrderResult = lastOrderResult;
    this.weeklyOrder = weeklyOrder;
    this.id = id;
  }
}
