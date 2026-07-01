import { Inject, Injectable } from '@nestjs/common';
import { Model, Schema } from 'mongoose';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

type FilmDocument = {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleSubdocument[];
};

type ScheduleSubdocument = {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

const scheduleSchema = new Schema<ScheduleSubdocument>(
  {
    id: { type: String, required: true },
    daytime: { type: Date, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], required: true, default: [] },
  },
  { _id: false },
);

export const filmSchema = new Schema<FilmDocument>(
  {
    id: { type: String, required: true, unique: true },
    rating: { type: Number, required: true },
    director: { type: String, required: true },
    tags: { type: [String], required: true, default: [] },
    image: { type: String, required: true },
    cover: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    description: { type: String, required: true },
    schedule: { type: [scheduleSchema], required: true, default: [] },
  },
  {
    versionKey: false,
  },
);

@Injectable()
export class FilmRepository {
  constructor(
    @Inject('FILM_MODEL')
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async getFilms(): Promise<FilmDto[]> {
    const films = await this.filmModel.find({}, { _id: 0 }).lean().exec();
    return films.map(this.toFilmDto);
  }

  async getScheduleByFilmId(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel
      .findOne({ id: filmId }, { _id: 0, schedule: 1 })
      .lean()
      .exec();

    if (!film) {
      return [];
    }

    return film.schedule.map(this.toScheduleDto);
  }

  async getScheduleByFilmAndSession(
    filmId: string,
    sessionId: string,
  ): Promise<ScheduleDto | null> {
    const film = await this.filmModel
      .findOne(
        { id: filmId, 'schedule.id': sessionId },
        { _id: 0, schedule: { $elemMatch: { id: sessionId } } },
      )
      .lean()
      .exec();

    if (!film || film.schedule.length === 0) {
      return null;
    }

    return this.toScheduleDto(film.schedule[0]);
  }

  async addTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeats: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $addToSet: { 'schedule.$.taken': { $each: takenSeats } } },
      )
      .exec();
  }

  private toFilmDto = (film: FilmDocument): FilmDto => ({
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    image: film.image,
    cover: film.cover,
    title: film.title,
    about: film.about,
    description: film.description,
    schedule: film.schedule.map(this.toScheduleDto),
  });

  private toScheduleDto = (schedule: ScheduleSubdocument): ScheduleDto => ({
    id: schedule.id,
    daytime: new Date(schedule.daytime).toISOString(),
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken,
  });
}
