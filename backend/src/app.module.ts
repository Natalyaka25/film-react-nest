import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import { Connection, connect } from 'mongoose';

import { AppConfig, configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { FilmRepository, filmSchema } from './repository/film.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    {
      provide: 'MONGODB_CONNECTION',
      useFactory: async (config: AppConfig): Promise<Connection> => {
        const mongoose = await connect(config.database.url);
        return mongoose.connection;
      },
      inject: ['CONFIG'],
    },
    {
      provide: 'FILM_MODEL',
      useFactory: (connection: Connection) =>
        connection.model('Film', filmSchema, 'films'),
      inject: ['MONGODB_CONNECTION'],
    },
    FilmRepository,
    FilmsService,
    OrderService,
  ],
})
export class AppModule {}
