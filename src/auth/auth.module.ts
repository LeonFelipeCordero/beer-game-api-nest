import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { GameSessionModule } from '../session/gameSession.module';

@Module({
  providers: [AuthService, LocalStrategy],
  exports: [AuthService, LocalStrategy],
  controllers: [AuthController],
  imports: [GameSessionModule],
})
export class AuthModule {}
