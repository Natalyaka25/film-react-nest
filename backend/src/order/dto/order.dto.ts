import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class TicketDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsString()
  daytime: string;

  @IsInt()
  @Min(1)
  row: number;

  @IsInt()
  @Min(1)
  seat: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class TicketResponseDto extends TicketDto {
  id: string;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}
