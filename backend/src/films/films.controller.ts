import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { ApiListDto } from '../common/dto/api-list.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<ApiListDto<FilmDto>> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getFilmSchedule(@Param('id') id: string): Promise<ApiListDto<ScheduleDto>> {
    return this.filmsService.getFilmSchedule(id);
  }
}
