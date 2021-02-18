import { Module } from '@nestjs/common';
import { GameSessionModule } from './session/gameSession.module';
import { FactoryModule } from './factory/factory.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { Connection } from 'typeorm';
import { JobsModule } from './jobs/jobs.module';
import { OrderModule } from './order/order.module';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlayerModule } from './player/player.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthModule } from './health/health.module';
import dbConfig from './app.config';

@Module({
  imports: [
    GameSessionModule,
    FactoryModule,
    ScheduleModule.forRoot(),
    AuthModule,
    dbConfig,
    JobsModule,
    OrderModule,
    EventsModule,
    EventEmitterModule.forRoot(),
    PlayerModule,
    TerminusModule,
    HealthModule,
  ],
})
export class AppModule {
  constructor(private connction: Connection) {}
}
