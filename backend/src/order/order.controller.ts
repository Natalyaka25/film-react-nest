import { Body, Controller, Post } from '@nestjs/common';
import { ApiListDto } from '../common/dto/api-list.dto';
import { OrderService } from './order.service';
import { CreateOrderDto, TicketResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(
    @Body() payload: CreateOrderDto,
  ): Promise<ApiListDto<TicketResponseDto>> {
    return this.orderService.createOrder(payload);
  }
}
