// src/professional/dto/create-availability.dto.ts
import { IsEnum, IsUUID, IsString } from 'class-validator';
export enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

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
