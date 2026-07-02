import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiListDto } from '../common/dto/api-list.dto';
import { FilmRepository } from '../repository/film.repository';
import { randomUUID } from 'node:crypto';
import { CreateOrderDto, TicketResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async createOrder(
    payload: CreateOrderDto,
  ): Promise<ApiListDto<TicketResponseDto>> {
    const groupedBySession = new Map<string, string[]>();
    const seatsInRequest = new Set<string>();

    for (const ticket of payload.tickets) {
      const seatKey = `${ticket.film}|${ticket.session}|${ticket.row}:${ticket.seat}`;
      if (seatsInRequest.has(seatKey)) {
        throw new ConflictException('Duplicate seat in order payload');
      }
      seatsInRequest.add(seatKey);

      const sessionKey = `${ticket.film}|${ticket.session}`;
      const takenSeatKey = `${ticket.row}:${ticket.seat}`;
      const seats = groupedBySession.get(sessionKey) ?? [];
      seats.push(takenSeatKey);
      groupedBySession.set(sessionKey, seats);
    }

    for (const [sessionKey, requestedSeats] of groupedBySession) {
      const [filmId, sessionId] = sessionKey.split('|');
      const result = await this.filmRepository.reserveTakenSeats(
        filmId,
        sessionId,
        requestedSeats,
      );

      if (result === 'not_found') {
        throw new NotFoundException('Film session not found');
      }

      if (result === 'conflict') {
        throw new ConflictException('Seat already taken');
      }
    }

    return {
      total: payload.tickets.length,
      items: payload.tickets.map((ticket) => ({
        ...ticket,
        id: randomUUID(),
      })),
    };
  }
}
