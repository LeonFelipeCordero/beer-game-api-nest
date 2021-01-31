import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GameSessionModule } from '../session/gameSession.module';
import { OrderModule } from '../order/order.module';

@Module({
  providers: [JobsService],
  imports: [GameSessionModule, OrderModule],
})
export class JobsModule {}
