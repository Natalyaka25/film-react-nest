import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const driver = configService.get<string>('DATABASE_DRIVER', 'postgres');

        if (driver !== 'postgres') {
          throw new Error(`Unsupported DATABASE_DRIVER: ${driver}`);
        }

        const username = configService.get<string>('DATABASE_USERNAME', 'prac');
        const password = configService.get<string>('DATABASE_PASSWORD', 'prac');
        const databaseUrl = configService.get<string>(
          'DATABASE_URL',
          'postgres://localhost:5432/prac',
        );

        return {
          type: 'postgres' as const,
          host: 'localhost',
          port: 5432,
          username,
          password,
          database: databaseUrl.split('/').pop() ?? 'prac',
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
