// src/professional/dto/create-availability.dto.ts
import { IsEnum, IsUUID, IsString } from 'class-validator';
import { Weekday } from './create-professional.dto';


export class CreateAvailabilityDto {
  @IsUUID()
  professionalId: string;

  @IsEnum(Weekday)
  weekday: Weekday;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}
