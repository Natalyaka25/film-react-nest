import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ApiListDto } from '../common/dto/api-list.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
  ) {}

  async getFilms(): Promise<ApiListDto<FilmDto>> {
    const items = await this.filmsRepository.getFilms();
    return {
      total: items.length,
      items,
    };
  }

  async getFilmSchedule(id: string): Promise<ApiListDto<ScheduleDto>> {
    const schedule = await this.filmsRepository.getScheduleByFilmId(id);

    if (schedule === null) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
