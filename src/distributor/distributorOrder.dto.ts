export interface DistributorOrderDTO {
  id?: string;
  orderedCrates?: number;
  deliveredCrates?: number;
  delivered?: boolean;
  distributorId?: string;
  wholesalerId?: string;
}
