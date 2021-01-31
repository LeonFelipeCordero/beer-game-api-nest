import { Module } from '@nestjs/common';
import { DistributorService } from './distributor.service';
import { DistributorController } from './distributor.controller';
import { WholesalerModule } from '../wholesaler/wholesaler.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Distributor } from './distributor.entity';
import { DistributorOrder } from './distributorOrder.entity';

@Module({
  controllers: [DistributorController],
  providers: [DistributorService],
  imports: [
    WholesalerModule,
    TypeOrmModule.forFeature([Distributor]),
    TypeOrmModule.forFeature([DistributorOrder]),
  ],
  exports: [DistributorService],
})
export class DistributorModule {}
