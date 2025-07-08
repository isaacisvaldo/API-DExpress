import {
  IsString,
  IsUUID,
  IsArray,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateLocationDto } from 'src/location/dto/create-location.dto';

export enum GeneralAvailability {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  DAILY = 'DAILY',
  WEEKENDS = 'WEEKENDS',
  ANY = 'ANY',
}

export enum ExperienceLevel {
  LESS_THAN_1 = 'LESS_THAN_1',
  ONE_TO_THREE = 'ONE_TO_THREE',
  THREE_TO_FIVE = 'THREE_TO_FIVE',
  MORE_THAN_FIVE = 'MORE_THAN_FIVE',
}

export enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}


export class CreateProfessionalDto {
  @ApiProperty({ example: 'Isaac Bunga' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'isaac@email.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+244923456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ enum: GeneralAvailability, example: GeneralAvailability.FULL_TIME })
  @IsEnum(GeneralAvailability)
  availabilityType: GeneralAvailability;

  @ApiProperty({ enum: ExperienceLevel, example: ExperienceLevel.THREE_TO_FIVE })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiProperty({
    example: ['23c1b774-2f33-4b90-8f83-874cbd02d9e5', 'd6c5f2de-35e6-4a25-996f-f0ec1584efbc'],
    type: [String],
  })
  @IsArray()
  specialtyIds: string[];

  @ApiProperty({ type: CreateLocationDto })
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}
