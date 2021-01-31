import { Injectable } from '@nestjs/common';
import { Retailer } from './retailer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetailerDTO } from './retailer.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderDeliveredEvent } from '../order/order.event';

@Injectable()
export class RetailerService {
  constructor(
    @InjectRepository(Retailer)
    private readonly retailerRepository: Repository<Retailer>,
  ) {}

  async getOne(id: string): Promise<Retailer> {
    return this.retailerRepository.findOne(id, {
      relations: ['gameSession', 'orders'],
    });
  }

  async insertOne(): Promise<Retailer> {
    return this.retailerRepository.save(new Retailer());
  }

  async updateOne(retailer: RetailerDTO): Promise<Retailer> {
    const { id } = retailer;
    return this.retailerRepository
      .update({ id }, retailer)
      .then(() => this.getOne(id));
  }

  @OnEvent('order.retailer.delivered')
  async handleOrderDelivered(payload: OrderDeliveredEvent) {
    const retailer = this.retailerRepository.create(payload.receiver)[0];
    const id = retailer.id;
    retailer.backlogInBeers -= payload.quantity;
    this.retailerRepository.update({ id }, retailer);
  }
}
