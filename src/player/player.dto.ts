import { PlayerType } from './player.type';

export interface PlayerDTO {
  id?: string;
  type: PlayerType;
  backlog: number;
  lastOrderResult: number;
  weeklyOrder: number;
  assigned?: boolean;
  gameSessionId: string;
}
