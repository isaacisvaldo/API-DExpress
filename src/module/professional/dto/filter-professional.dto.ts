// src/professional/dto/filter-professional.dto.ts
import { IsOptional, IsString, IsEnum, IsArray, IsNumber, Min, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FilterProfessionalDto {
  @ApiPropertyOptional({ description: 'Filter by professional\'s full name.' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by city ID where the professional is located.' })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiPropertyOptional({ description: 'Filter by district ID where the professional is located.' })
  @IsOptional()
  @IsUUID()
  districtId?: string;

  // ✅ Agora é UUID do tipo relacionado (não Enum)
  @ApiPropertyOptional({ example: 'uuid-do-tipo-disponibilidade', description: 'ID do tipo de disponibilidade' })
  @IsUUID()
  availabilityTypeId: string;

  // ✅ Agora é UUID do tipo relacionado (não Enum)
  @ApiPropertyOptional({ example: 'uuid-do-nivel-experiencia', description: 'ID do nível de experiência' })
  @IsUUID()
  experienceLevelId: string;

  @ApiPropertyOptional({ description: 'Filter by specialty ID.' })
  @IsOptional()
  @IsUUID()
  specialtyId?: string;

  // --- NEW FILTERS ---

  @ApiPropertyOptional({ description: 'Filter by desired position ID.' })
  @IsOptional()
  @IsUUID()
  desiredPositionId?: string;

  @ApiPropertyOptional({ description: 'Filter by gender ID.' })
  @IsOptional()
  @IsUUID()
  genderId?: string;

  @ApiPropertyOptional({ description: 'Filter by marital status ID.' })
  @IsOptional()
  @IsUUID()
  maritalStatusId?: string;

  @ApiPropertyOptional({ description: 'Filter by highest degree ID.' })
  @IsOptional()
  @IsUUID()
  highestDegreeId?: string;

  @ApiPropertyOptional({ type: [String], description: 'Filter by course IDs (professional must have ALL specified courses).' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  courseIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Filter by language IDs (professional must speak ALL specified languages).' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  languageIds?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Filter by skill IDs (professional must possess ALL specified skills).' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds?: string[];

  // --- PAGINATION & OTHER FILTERS (Existing) ---

  @ApiPropertyOptional({ description: 'Page number for pagination (starts at 1).', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page (minimum 1).', minimum: 1, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  // You might also want to add filters for boolean flags if needed:
  @ApiPropertyOptional({ description: 'Filter by criminal record status.' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) // Important for boolean query params
  hasCriminalRecord?: boolean;

  @ApiPropertyOptional({ description: 'Filter by medical certificate status.' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasMedicalCertificate?: boolean;

  @ApiPropertyOptional({ description: 'Filter by training certificate status.' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasTrainingCertificate?: boolean;

  @ApiPropertyOptional({ description: 'Filter by presence of children.' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasChildren?: boolean;
}