import { Module } from '@nestjs/common';
import { RetailerControler } from './retailer.controller';
import { RetailerService } from './retailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Retailer } from './retailer.entity';
import { RetailerOrder } from './retailerOrder.entity';

@Module({
  controllers: [RetailerControler],
  providers: [RetailerService],
  imports: [TypeOrmModule.forFeature([Retailer, RetailerOrder])],
  exports: [RetailerService],
})
export class RetailerModule {}
