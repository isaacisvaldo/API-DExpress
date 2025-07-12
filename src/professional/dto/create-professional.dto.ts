import {
  IsString,
  IsUUID,
  IsArray,
  IsEnum,

  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


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



export class CreateProfessionalDto {
  @ApiProperty({
    example: 'a2f648f5-6dcd-4e3a-bdd7-26b814d6f5b6',
    description: 'ID da candidatura aprovada',
  })
  @IsUUID()
  applicationId: string;

  @ApiProperty({
    example: 50000,
    description: 'Pretensão salarial em Kz',
  })
  @IsNumber()
  expectedSalary: number;

  @ApiProperty({
    enum: GeneralAvailability,
    example: GeneralAvailability.FULL_TIME,
    description: 'Tipo de disponibilidade',
  })
  @IsEnum(GeneralAvailability)
  availabilityType: GeneralAvailability;

  @ApiProperty({
    enum: ExperienceLevel,
    example: ExperienceLevel.ONE_TO_THREE,
    description: 'Nível de experiência',
  })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiProperty({
    example: [
      '23c1b774-2f33-4b90-8f83-874cbd02d9e5',
      'd6c5f2de-35e6-4a25-996f-f0ec1584efbc',
    ],
    type: [String],
    description: 'IDs das especialidades',
  })
  @IsArray()
  specialtyIds: string[];
}
