import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export interface FilmsRepository {
  getFilms(): Promise<FilmDto[]>;
  getScheduleByFilmId(filmId: string): Promise<ScheduleDto[] | null>;
  getScheduleByFilmAndSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null>;
  reserveTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<'reserved' | 'not_found' | 'conflict'>;
}

export const FILMS_REPOSITORY = 'FilmsRepository';
