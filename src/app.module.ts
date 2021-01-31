import { Module } from '@nestjs/common';
import { RetailerModule } from './retailer/retailer.module';
import { GameSessionModule } from './session/gameSession.module';
import { WholesalerModule } from './wholesaler/wholesaler.module';
import { DistributorModule } from './distributor/distributor.module';
import { FactoryModule } from './factory/factory.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { JobsModule } from './jobs/jobs.module';
import { OrderModule } from './order/order.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayerModule } from './player/player.module';

const typeOrmModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'beer-game',
  password: 'beer-game',
  database: 'beer-game',
  autoLoadEntities: true,
  synchronize: true, // todo should not be used in production, it can end lossing data
});

@Module({
  imports: [
    RetailerModule,
    GameSessionModule,
    WholesalerModule,
    DistributorModule,
    FactoryModule,
    ScheduleModule.forRoot(),
    AuthModule,
    typeOrmModule,
    JobsModule,
    OrderModule,
    EventsModule,
    EventEmitterModule.forRoot(),
    PlayerModule,
  ],
})
export class AppModule {
  constructor(private connction: Connection) {}
}
