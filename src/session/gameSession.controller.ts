import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GameSessionService } from './gameSession.service';
import { GameSessionRequest } from './model/gameSession.request';

@Controller('game-sessions')
export class GameSessionController {
  constructor(private readonly gameSeionService: GameSessionService) {}

  @Get(':id')
  async getSession(@Param('id') id: string): Promise<any> {
    return this.gameSeionService.getOne(id);
  }

  @Post()
  async createSession(@Body() request: GameSessionRequest): Promise<any> {
    return this.gameSeionService.insertOne(request);
  }
}
