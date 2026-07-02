import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiListDto } from '../common/dto/api-list.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmRepository } from '../repository/film.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async getFilms(): Promise<ApiListDto<FilmDto>> {
    const items = await this.filmRepository.getFilms();
    return {
      total: items.length,
      items,
    };
  }

  async getFilmSchedule(id: string): Promise<ApiListDto<ScheduleDto>> {
    const schedule = await this.filmRepository.getScheduleByFilmId(id);

    if (schedule === null) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
