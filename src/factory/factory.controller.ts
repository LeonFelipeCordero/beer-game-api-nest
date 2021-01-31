import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { FactoryDTO } from './factory.dto';

@Controller('factories')
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get(':id')
  async getFactory(@Param('id') id: string): Promise<any> {
    return this.factoryService.getOne(id);
  }

  @Patch(':id')
  async updateFactoryOrder(@Body() factory: FactoryDTO): Promise<any> {
    return this.factoryService.updateOne(factory);
  }
}
