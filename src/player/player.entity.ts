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

  @ManyToOne(() => GameSession, (gameSession) => gameSession.players)
  gameSession: GameSession;

  @OneToMany(() => Order, (order) => order.sender)
  sendingOrders: Order[];

  @OneToMany(() => Order, (order) => order.receiver)
  receivingOrders: Order[];

  constructor(
    type: PlayerType,
    backlog: number,
    weeklyOrder: number,
    lastOrderResult: number,
    gameSession?: GameSession,
    sendingOrders?: Order[],
    receivingOrders?: Order[],
    id?: string,
  ) {
    this.type = type;
    this.gameSession = gameSession;
    this.sendingOrders = sendingOrders;
    this.receivingOrders = receivingOrders;
    this.backlog = backlog;
    this.lastOrderResult = lastOrderResult;
    this.weeklyOrder = weeklyOrder;
    this.id = id;
  }
}
