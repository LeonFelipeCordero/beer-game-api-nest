import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Factory } from './factory.entity';

@Entity('factory_order')
export class FactoryOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 5 })
  orderedCrates: number;

  @Column({ default: 5 })
  deliveredCrates: number;

  @Column({ default: false })
  delivered: boolean;

  @ManyToOne(() => Factory, (factory) => factory.orders)
  factory: Factory;

  constructor(
    orderedCrates: number,
    factory: Factory,
    deliveredCrates?: number,
    delivered?: boolean,
    id?: string,
  ) {
    this.orderedCrates = orderedCrates;
    this.factory = factory;
    this.deliveredCrates = deliveredCrates;
    this.delivered = delivered;
    this.id = id;
  }
}
