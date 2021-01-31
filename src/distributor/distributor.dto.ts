import { GameSession } from '../session/gameSession.entity';

export interface DistributorDTO {
  id?: string;
  backlogInCrates?: number;
  lastOrderResult?: number;
  weeklyOrder?: number;
  assigned?: boolean;
  gameSession?: GameSession;
}
