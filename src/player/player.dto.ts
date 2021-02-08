import { PlayerType } from './player.type';

export interface PlayerDTO {
  type: PlayerType;
  backlog: number;
  lastOrderResult: number;
  weeklyOrder: number;
  gameSessionId: string;
  id?: string;
  assigned?: boolean;
}
