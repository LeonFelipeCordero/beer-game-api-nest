import { Injectable } from '@nestjs/common';
import { Wholesaler } from './wholesaler.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WholesalerDTO } from './wholesaler.dto';

@Injectable()
export class WholesalerService {
  constructor(
    @InjectRepository(Wholesaler)
    private readonly wholesalerRepository: Repository<Wholesaler>,
  ) {}

  async getOne(id: string): Promise<Wholesaler> {
    return this.wholesalerRepository.findOne(id, {
      relations: ['gameSession', 'orders'],
    });
  }

  async insertOne(): Promise<Wholesaler> {
    return this.wholesalerRepository.save(new Wholesaler());
  }

  async updateOne(wholesaler: WholesalerDTO): Promise<Wholesaler> {
    const { id } = wholesaler;
    return this.wholesalerRepository
      .update({ id }, wholesaler)
      .then(() => this.getOne(id));
  }
}
