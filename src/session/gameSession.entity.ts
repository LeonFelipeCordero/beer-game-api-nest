import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Factory } from '../factory/factory.entity';
import { Player } from '../player/player.entity';

@Entity('game_session')
export class GameSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  datetime: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  finished: boolean;

  @JoinColumn()
  @OneToOne(() => Factory, (factory) => factory.gameSession)
  factory: Factory;

  @JoinColumn()
  @OneToMany(() => Player, (player) => player.gameSession)
  players: Player[];

  constructor(
    name: string,
    password: string,
    datetime: Date,
    id?: string,
    active = true,
    completed = false,
    finished = false,
  ) {
    this.name = name;
    this.password = password;
    this.datetime = datetime;
    this.id = id;
    this.active = active;
    this.completed = completed;
    this.finished = finished;
  }
}
