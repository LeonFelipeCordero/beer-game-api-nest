import { GameSession } from '../session/gameSession.entity';
import { WholesalerOrder } from './wholesalerOrder.entity';

export interface WholesalerDTO {
  id?: string;
  backlogInCrates?: number;
  lastOrderResult?: number;
  weeklyOrder?: number;
  assigned?: boolean;
  gameSession?: GameSession;
  orders?: WholesalerOrder[];
}
