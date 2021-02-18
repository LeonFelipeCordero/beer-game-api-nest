import { GameSession } from '../session/gameSession.entity';

export interface FactoryDTO {
  id?: string;
  backlogSpecialBeer?: number;
  backlogOthers?: number;
  fullCapacity?: number;
  weeklyProduction?: number;
  weeklySpecialProduction?: number;
  assigned?: boolean;
  increaseCapacity?: boolean;
  increaseInProgress?: boolean;
  gameSession?: GameSession;
}
