import { GameSession } from '../session/gameSession.entity';
import { RetailerOrder } from './retailerOrder.entity';

export interface RetailerDTO {
  id?: string;
  backlogInBeers?: number;
  lastOrderResult?: number;
  weeklyOrder?: number;
  assigned?: boolean;
  gameSession?: GameSession;
  orders?: RetailerOrder[];
}
