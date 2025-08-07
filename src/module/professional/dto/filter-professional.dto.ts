// src/professional/dto/filter-professional.dto.ts
import { IsOptional, IsString, IsEnum, IsArray, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ExperienceLevel, GeneralAvailability } from './create-professional.dto'; // ajuste se estiver em outro arquivo
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProfessionalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ enum: GeneralAvailability })
  @IsOptional()
  @IsEnum(GeneralAvailability)
  availabilityType?: GeneralAvailability;

  @ApiPropertyOptional({ enum: ExperienceLevel })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialtyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
