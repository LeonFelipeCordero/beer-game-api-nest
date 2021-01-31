import { Injectable, Logger } from '@nestjs/common';
import { GameSessionRequest } from './model/gameSession.request';
import { Repository } from 'typeorm';
import { GameSession } from './gameSession.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FactoryService } from '../factory/factory.service';
import { PlayerService } from '../player/player.service';
import { PlayerType } from '../player/player.type';

@Injectable()
export class GameSessionService {
  private readonly logger: Logger;
  private readonly playersInfo: any;

  constructor(
    private readonly factoryService: FactoryService,
    private readonly playerService: PlayerService,
    @InjectRepository(GameSession)
    private readonly sessionRepository: Repository<GameSession>,
  ) {
    this.logger = new Logger(GameSessionService.name);
    this.playersInfo = [
      {
        type: PlayerType.Retailer,
        backlog: 100,
        lastOrderResult: 5,
        weeklyOrder: 5,
      },
      {
        type: PlayerType.Wholesaler,
        backlog: 50,
        lastOrderResult: 50,
        weeklyOrder: 50,
      },
      {
        type: PlayerType.Distributor,
        backlog: 150,
        lastOrderResult: 150,
        weeklyOrder: 150,
      },
    ];
  }

  async getOne(id: string): Promise<GameSession> {
    return this.sessionRepository.findOne(id, {
      relations: ['factory', 'players'],
    });
  }

  async getOneByName(name: string): Promise<GameSession> {
    return this.sessionRepository.findOne({
      where: [{ name: name }],
      relations: ['factory', 'players'],
    });
  }

  async getAllCompletedSessions(): Promise<GameSession[]> {
    return this.sessionRepository.find({
      where: [{ active: true, completed: true, finished: false }],
      relations: ['factory', 'players'],
    });
  }

  async checkForCompleteness() {
    this.sessionRepository
      .find({
        where: [{ active: true, completed: false, finished: false }],
        relations: ['factory', 'players'],
      })
      .then((sessions) => {
        sessions.forEach((session) => {
          if (this.isSessionComplete(session)) {
            this.logger.log(
              `setting session ${session.id} as completed and ready to play`,
            );
            session.completed = true;
            this.sessionRepository.save(session);
          }
        });
      });
  }

  async insertOne(request: GameSessionRequest): Promise<GameSession> {
    const session = new GameSession(request.name, request.password, new Date());
    return this.factoryService
      .insertOne()
      .then((factory) => {
        session.factory = factory;
      })
      .then(() => {
        this.playersInfo.forEach(
          (info: any) => (info['sessionId'] = session.id),
        );
        return this.playerService.insertMany(this.playersInfo);
      })
      .then((players) => {
        session.players = players;
      })
      .then(() => this.sessionRepository.save(session));
  }

  private isSessionComplete(session: GameSession) {
    return (
      session.factory.assigned &&
      !session.players.map((player) => player.assigned).includes(false)
    );
  }
}
