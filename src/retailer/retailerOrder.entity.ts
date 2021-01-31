import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Retailer } from './retailer.entity';

@Entity('retailer_order')
export class RetailerOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 5 })
  orderedBeers: number;

  @Column({ default: 5 })
  deliveredBeers: number;

  @Column({ default: true })
  delivered: boolean;

  @ManyToOne(() => Retailer, (retailer) => retailer.orders)
  retailer: Retailer;

  constructor(
    orderedBeers: number,
    retailer: Retailer,
    deliveredBeers?: number,
    delivered?: boolean,
    id?: string,
  ) {
    this.orderedBeers = orderedBeers;
    this.retailer = retailer;
    this.deliveredBeers = deliveredBeers;
    this.delivered = delivered;
    this.id = id;
  }
}
