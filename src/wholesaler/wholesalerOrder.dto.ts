export interface WholesalerOrderDTO {
  id?: string;
  orderedCrates?: number;
  deliveredCrates?: number;
  delivered?: boolean;
  wholesalerId?: string;
  retailerId?: string;
}
