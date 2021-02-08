import { Module } from '@nestjs/common';
import { FactoryService } from './factory.service';
import { FactoryController } from './factory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factory } from './factory.entity';

@Module({
  controllers: [FactoryController],
  providers: [FactoryService],
  imports: [TypeOrmModule.forFeature([Factory])],
  exports: [FactoryService],
})
export class FactoryModule {}
