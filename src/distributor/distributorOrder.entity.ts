import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Distributor } from './distributor.entity';

@Entity('distributor_order')
export class DistributorOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 5 })
  orderedCrates: number;

  @Column({ default: 5 })
  deliveredCrates: number;

  @Column({ default: false })
  delivered: boolean;

  @ManyToOne(() => Distributor, (distributor) => distributor.orders)
  distributor: Distributor;

  constructor(
    orderedCrates: number,
    distributor: Distributor,
    deliveredCrates?: number,
    delivered?: boolean,
    id?: string,
  ) {
    this.orderedCrates = orderedCrates;
    this.distributor = distributor;
    this.deliveredCrates = deliveredCrates;
    this.delivered = delivered;
    this.id = id;
  }
}
