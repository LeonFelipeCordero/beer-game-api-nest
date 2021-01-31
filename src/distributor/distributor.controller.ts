import { Controller, Body, Get, Param, Patch } from '@nestjs/common';
import { DistributorService } from './distributor.service';
import { DistributorDTO } from './distributor.dto';

@Controller('distributors')
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  @Get(':id')
  async getDistributor(@Param('id') id: string): Promise<any> {
    return this.distributorService.getOne(id);
  }

  @Patch(':id')
  async updateWeeklyCrates(@Body() distributor: DistributorDTO): Promise<any> {
    return this.distributorService.updateOne(distributor);
  }
}
