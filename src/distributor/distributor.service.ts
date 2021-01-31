import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Distributor } from './distributor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DistributorDTO } from './distributor.dto';

@Injectable()
export class DistributorService {
  constructor(
    @InjectRepository(Distributor)
    private readonly distributorRepository: Repository<Distributor>,
  ) {}

  async getOne(id: string): Promise<Distributor> {
    return this.distributorRepository.findOne(id, {
      relations: ['gameSession', 'orders'],
    });
  }

  async insertOne(): Promise<Distributor> {
    return this.distributorRepository.save(new Distributor());
  }

  async updateOne(distributor: DistributorDTO): Promise<Distributor> {
    const { id } = distributor;
    return this.distributorRepository
      .update({ id }, distributor)
      .then(() => this.getOne(id));
  }
}
