import { Controller, Body, Get, Param, Patch } from '@nestjs/common';
import { WholesalerService } from './wholesaler.service';
import { WholesalerDTO } from './wholesaler.dto';
import { Wholesaler } from './wholesaler.entity';

@Controller('wholesalers')
export class WholesalerController {
  constructor(private readonly wholesalerService: WholesalerService) {}

  @Get(':id')
  async getWholesaler(@Param('id') id: string): Promise<Wholesaler> {
    return this.wholesalerService.getOne(id);
  }

  @Patch(':id')
  async updateWeeklyCrates(
    @Body() wholesaler: WholesalerDTO,
  ): Promise<Wholesaler> {
    return this.wholesalerService.updateOne(wholesaler);
  }
}
