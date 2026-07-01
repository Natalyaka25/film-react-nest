export class TicketDto {
  film: string;
  session: string;
  row: number;
  seat: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}
