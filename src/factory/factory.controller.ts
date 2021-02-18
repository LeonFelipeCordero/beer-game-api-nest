import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { FactoryDTO } from './factory.dto';
import { Factory } from './factory.entity';

@Controller('factories')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get(':id')
  async getFactory(@Param('id') id: string): Promise<Factory> {
    return this.factoryService.getOne(id);
  }

  @Patch(':id')
  async updateFactoryOrder(@Body() factory: FactoryDTO): Promise<Factory> {
    return this.factoryService.updateOne(factory);
  }

  @Patch(':id/capacity')
  async increaseCapacity(@Param('id') id: string): Promise<Factory> {
    return this.factoryService.increaseCapacity(id);
  }
}
