import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GameSessionService } from '../session/gameSession.service';
import { GameSession } from '../session/gameSession.entity';
import { OrderService } from '../order/order.service';
import { OrderType } from '../order/order.type';

@Injectable()
export class JobsService {
  private readonly logger: Logger;

  constructor(
    private readonly orderService: OrderService,
    private readonly gameSessoinService: GameSessionService,
  ) {
    this.logger = new Logger(JobsService.name);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  checkForCompleteness() {
    this.gameSessoinService.checkForCompleteness();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  createOrders() {
    this.logger.log('starting new round of orders');
    this.gameSessoinService.getAllCompletedSessions().then((sessions) => {
      sessions.forEach((session) => this.startOrdering(session));
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  stopOrdersDelay() {
    this.orderService.unblockOrders();
  }

  private startOrdering(session: GameSession) {
    this.logger.log(`creating order for session ${session.id}`);
    this.orderService
      .insertOne(this.createDto(session.id, OrderType.RetailerOrder), true)
      .then(() =>
        this.orderService.insertOne(
          this.createDto(session.id, OrderType.WholesalerOrder),
          true,
        ),
      )
      .then(() =>
        this.orderService.insertOne(
          this.createDto(session.id, OrderType.DistributorOrder),
          true,
        ),
      )
      .then(() =>
        this.orderService.insertOne(
          this.createDto(session.id, OrderType.FactoryOrder),
          true,
        ),
      );
  }

  private createDto(session: string, type: OrderType) {
    return {
      session: session,
      type: type,
    };
  }
}
