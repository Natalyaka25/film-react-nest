import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;

  const orderServiceMock = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderServiceMock }],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('передаёт заказ в сервис и возвращает созданные билеты', async () => {
      const payload: CreateOrderDto = {
        email: 'user@example.com',
        phone: '+79990001122',
        tickets: [
          {
            film: '11111111-1111-1111-1111-111111111111',
            session: '22222222-2222-2222-2222-222222222222',
            daytime: '2024-01-01T10:00:00.000Z',
            row: 1,
            seat: 2,
            price: 350,
          },
        ],
      };
      const expected = {
        total: 1,
        items: [{ ...payload.tickets[0], id: 'ticket-1' }],
      };
      orderServiceMock.createOrder.mockResolvedValue(expected);

      await expect(controller.createOrder(payload)).resolves.toEqual(expected);
      expect(orderServiceMock.createOrder).toHaveBeenCalledWith(payload);
    });
  });
});
