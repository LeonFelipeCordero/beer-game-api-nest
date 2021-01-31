export interface FactoryOrderDTO {
  id?: string;
  orderedCrates?: number;
  deliveredCrates?: number;
  delivered?: boolean;
  factoryId?: string;
  distributorId?: string;
}
