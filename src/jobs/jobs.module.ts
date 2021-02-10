import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GameSessionModule } from '../session/gameSession.module';
import { OrderModule } from '../order/order.module';
import { FactoryModule } from '../factory/factory.module';

@Module({
  providers: [JobsService],
  imports: [GameSessionModule, OrderModule, FactoryModule],
})
export class JobsModule {}
