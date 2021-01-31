import { Injectable, Logger } from '@nestjs/common';
import { GameSessionService } from '../session/gameSession.service';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(private readonly gameSessionService: GameSessionService) {
    this.logger = new Logger(AuthService.name);
  }

  async validateSession(username: string, pass: string): Promise<any> {
    return this.gameSessionService.getOneByName(username).then((session) => {
      if (session && session.password === pass) {
        const { password, ...result } = session;
        return result;
      }
      return null;
    });
  }
}
