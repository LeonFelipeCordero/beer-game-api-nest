import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderDTO } from './order.dto';
import { Order } from './order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOne(id);
  }

  @Post()
  async createOrder(@Body() request: OrderDTO): Promise<Order> {
    return this.orderService.insertOne(request);
  }

  @Patch(':id')
  async updateOrder(@Body() request: OrderDTO): Promise<Order> {
    return this.orderService.updateOne(request);
  }

  @Patch(':id/deliver')
  async deliverOrdeR(@Body() request: OrderDTO): Promise<Order> {
    return this.orderService.updateOne(request, true);
  }
}
