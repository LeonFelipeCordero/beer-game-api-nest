import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wholesaler } from './wholesaler.entity';

@Entity('wholesaler_order')
export class WholesalerOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 5 })
  orderedCrates: number;

  @Column({ default: 5 })
  deliveredCrates: number;

  @Column({ default: false })
  delivered: boolean;

  @ManyToOne(() => Wholesaler, (wholesaler) => wholesaler.orders)
  wholesaler: Wholesaler;

  constructor(
    orderedCrates: number,
    wholesaler: Wholesaler,
    deliveredCrates?: number,
    delivered?: boolean,
    id?: string,
  ) {
    this.orderedCrates = orderedCrates;
    this.wholesaler = wholesaler;
    this.deliveredCrates = deliveredCrates;
    this.delivered = delivered;
    this.id = id;
  }
}
