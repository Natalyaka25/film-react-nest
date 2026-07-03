import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async getFilms(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({
      relations: ['schedules'],
    });

    return films.map(this.toFilmDto);
  }

  async getScheduleByFilmId(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmRepository.findOne({ where: { id: filmId } });

    if (!film) {
      return null;
    }

    const schedules = await this.scheduleRepository.find({
      where: { filmId },
    });

    return schedules.map(this.toScheduleDto);
  }

  async getScheduleByFilmAndSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });

    if (!schedule) {
      return null;
    }

    return this.toScheduleDto(schedule);
  }

  async reserveTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<'reserved' | 'not_found' | 'conflict'> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });

    if (!schedule) {
      return 'not_found';
    }

    const currentTaken = this.parseTaken(schedule.taken);
    const hasTakenSeat = takenSeats.some((seat) => currentTaken.includes(seat));

    if (hasTakenSeat) {
      return 'conflict';
    }

    const newTaken = this.serializeTaken([...currentTaken, ...takenSeats]);
    const result = await this.scheduleRepository.update(
      { id: sessionId, filmId, taken: schedule.taken },
      { taken: newTaken },
    );

    return result.affected ? 'reserved' : 'conflict';
  }

  private toFilmDto = (film: Film): FilmDto => ({
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: [film.tags],
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
    schedule: (film.schedules ?? []).map(this.toScheduleDto),
  });

  private toScheduleDto = (schedule: Schedule): ScheduleDto => ({
    id: schedule.id,
    daytime: new Date(schedule.daytime).toISOString(),
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: this.parseTaken(schedule.taken),
  });

  private parseTaken = (taken: string): string[] => {
    if (!taken) {
      return [];
    }

    return taken.split(',').filter(Boolean);
  };

  private serializeTaken = (seats: string[]): string => seats.join(',');
}
