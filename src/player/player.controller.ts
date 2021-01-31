import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerDTO } from './player.dto';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id')
  async getPlayer(@Param('id') id: string) {
    return this.playerService.getOne(id);
  }

  @Patch(':id')
  async updatePlayer(@Body() request: PlayerDTO) {
    return this.playerService.updateOne(request);
  }
}
