import { Module } from '@nestjs/common';
import { WholesalerController } from './wholesaler.controller';
import { WholesalerService } from './wholesaler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wholesaler } from './wholesaler.entity';
import { WholesalerOrder } from './wholesalerOrder.entity';
import { RetailerModule } from '../retailer/retailer.module';

@Module({
  controllers: [WholesalerController],
  providers: [WholesalerService],
  imports: [
    RetailerModule,
    TypeOrmModule.forFeature([Wholesaler]),
    TypeOrmModule.forFeature([WholesalerOrder]),
  ],
  exports: [WholesalerService],
})
export class WholesalerModule {}
