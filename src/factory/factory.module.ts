import { Module } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { FactoryController } from './factory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './factory.entity';
import { FactoryOrder } from './factoryOrder.entity';
import { DistributorModule } from '../distributor/distributor.module';

@Module({
  controllers: [FactoryController],
  providers: [FactoryService],
  imports: [
    DistributorModule,
    TypeOrmModule.forFeature([Factory]),
    TypeOrmModule.forFeature([FactoryOrder]),
  ],
  exports: [FactoryService],
})
export class FactoryModule {}
