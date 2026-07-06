import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsServiceMock = {
    getFilms: jest.fn(),
    getFilmSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsServiceMock }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('возвращает список фильмов из сервиса', async () => {
      const films: FilmDto[] = [
        {
          id: 'film-1',
          rating: 8.5,
          director: 'Director',
          tags: ['drama'],
          title: 'Film',
          about: 'About',
          description: 'Description',
          image: '/image.jpg',
          cover: '/cover.jpg',
          schedule: [],
        },
      ];
      const expected = { total: 1, items: films };
      filmsServiceMock.getFilms.mockResolvedValue(expected);

      await expect(controller.getFilms()).resolves.toEqual(expected);
      expect(filmsServiceMock.getFilms).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFilmSchedule', () => {
    it('возвращает расписание фильма по id', async () => {
      const filmId = 'film-1';
      const expected = {
        total: 1,
        items: [
          {
            id: 'session-1',
            daytime: '2024-01-01T10:00:00.000Z',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      };
      filmsServiceMock.getFilmSchedule.mockResolvedValue(expected);

      await expect(controller.getFilmSchedule(filmId)).resolves.toEqual(
        expected,
      );
      expect(filmsServiceMock.getFilmSchedule).toHaveBeenCalledWith(filmId);
    });
  });
});
