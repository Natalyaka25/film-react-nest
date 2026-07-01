import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiListDto } from '../common/dto/api-list.dto';
import { FilmRepository } from '../repository/film.repository';
import { CreateOrderDto, TicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async createOrder(payload: CreateOrderDto): Promise<ApiListDto<TicketDto>> {
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
      const schedule = await this.filmRepository.getScheduleByFilmAndSession(
        filmId,
        sessionId,
      );

      if (!schedule) {
        throw new NotFoundException('Film session not found');
      }

      const hasTakenSeat = requestedSeats.some((seat) =>
        schedule.taken.includes(seat),
      );
      if (hasTakenSeat) {
        throw new ConflictException('Seat already taken');
      }
    }

    for (const [sessionKey, requestedSeats] of groupedBySession) {
      const [filmId, sessionId] = sessionKey.split('|');
      await this.filmRepository.addTakenSeats(
        filmId,
        sessionId,
        requestedSeats,
      );
    }

    return {
      total: payload.tickets.length,
      items: payload.tickets,
    };
  }
}
