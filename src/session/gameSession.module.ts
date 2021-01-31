import { Module } from '@nestjs/common';
import { GameSessionController } from './gameSession.controller';
import { GameSessionService } from './gameSession.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameSession } from './gameSession.entity';
import { FactoryModule } from '../factory/factory.module';
import { PlayerModule } from '../player/player.module';

@Module({
  controllers: [GameSessionController],
  providers: [GameSessionService],
  imports: [
    TypeOrmModule.forFeature([GameSession]),
    FactoryModule,
    PlayerModule,
  ],
  exports: [GameSessionService],
})
export class GameSessionModule {}
