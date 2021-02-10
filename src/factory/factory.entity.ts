import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { GameSession } from '../session/gameSession.entity';
import { Order } from '../order/order.entity';

@Entity('factory')
export class Factory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 500 })
  backlogSpecialBeer: number;

  @Column({ default: 2500 })
  backlogOthers: number;

  @Column({ default: 1000 })
  fullCapacity: number;

  @Column({ default: 200 })
  weeklySpecialProduction: number;

  @Column({ default: 500 })
  weeklyProduction: number;

  @Column({ default: false })
  assigned: boolean;

  @Column({ default: false })
  increaseCapacity: boolean;

  @OneToOne(() => GameSession, (gameSession) => gameSession.factory)
  gameSession: GameSession;

  @OneToMany(() => Order, (order) => order.factory)
  orders: Order[];

  constructor(
    gameSession?: GameSession,
    orders?: Order[],
    fullCapacity?: number,
    weeklyProduction?: number,
    weeklySpecialProduction?: number,
    id?: string,
  ) {
    this.gameSession = gameSession;
    this.orders = orders;
    this.fullCapacity = fullCapacity;
    this.weeklyProduction = weeklyProduction;
    this.weeklySpecialProduction = weeklySpecialProduction;
    this.id = id;
  }
}
