import { Retailer } from './retailer.entity';

export interface RetailerOrderDTO {
  id?: string;
  orderedCrates?: number;
  deliveredCrates?: number;
  delivered?: boolean;
  retailer?: Retailer;
}
