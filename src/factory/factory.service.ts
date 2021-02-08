import { Injectable } from '@nestjs/common';
import { Factory } from './factory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactoryDTO } from './factory.dto';

@Injectable()
export class FactoryService {
  constructor(
    @InjectRepository(Factory)
    private readonly factoryRepository: Repository<Factory>,
  ) {}

  async getOne(id: string): Promise<Factory> {
    return this.factoryRepository.findOneOrFail(id, {
      relations: ['gameSession', 'orders'],
    });
  }

  async insertOne(): Promise<Factory> {
    return this.factoryRepository.save(new Factory());
  }

  async updateOne(factory: FactoryDTO): Promise<Factory> {
    const { id } = factory;
    return this.factoryRepository
      .update({ id }, factory)
      .then(() => this.getOne(id));
  }
}
