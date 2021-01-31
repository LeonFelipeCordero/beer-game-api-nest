import { Controller, Body, Get, Param, Patch } from '@nestjs/common';
import { RetailerService } from './retailer.service';
import { RetailerDTO } from './retailer.dto';
import { Retailer } from './retailer.entity';

@Controller('retailers')
export class RetailerControler {
  constructor(private readonly retailerService: RetailerService) {}

  @Get(':id')
  async getRetailer(@Param('id') id: string): Promise<Retailer> {
    return this.retailerService.getOne(id);
  }

  @Patch(':id')
  async updateWeeklyCrates(@Body() retailer: RetailerDTO): Promise<Retailer> {
    return this.retailerService.updateOne(retailer);
  }
}
