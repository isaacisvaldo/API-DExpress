// src/professional/dto/filter-professional.dto.ts
import { IsOptional, IsString, IsNumber, Min, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
  
  @ApiPropertyOptional({ example: 'uuid-do-tipo-disponibilidade', description: 'ID do tipo de disponibilidade' })
  @IsOptional()
  @IsUUID()
  availabilityTypeId?: string;

  @ApiPropertyOptional({ example: 'uuid-do-nivel-experiencia', description: 'ID do nível de experiência' })
  @IsOptional()
  @IsUUID()
  experienceLevelId?: string;

  @ApiPropertyOptional({ description: 'Filter by specialty ID.' })
  @IsOptional()
  @IsUUID()
  specialtyId?: string;

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

  @ApiPropertyOptional({ description: 'Filter by a specific course ID.' })
  @IsOptional()
  @IsUUID()
  courseId?: string; // Alterado para um único ID

  @ApiPropertyOptional({ description: 'Filter by a specific language ID.' })
  @IsOptional()
  @IsUUID()
  languageId?: string; // Alterado para um único ID

  @ApiPropertyOptional({ description: 'Filter by a specific skill ID.' })
  @IsOptional()
  @IsUUID()
  skillId?: string; // Alterado para um único ID

  @ApiPropertyOptional({ description: 'Filter by a specific experience ID.' })
  @IsOptional()
  @IsUUID()
  experienceId?: string; // Adicionado para filtrar experiência por um único ID

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

  @ApiPropertyOptional({ description: 'Filter by criminal record status.' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
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