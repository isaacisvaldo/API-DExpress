import { IsOptional, IsString, IsEnum, IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { JobApplicationStatus } from '@prisma/client';

export class FilterJobApplicationDto {
  @ApiPropertyOptional({ description: 'Filtra por nome completo do candidato' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ enum: JobApplicationStatus, description: 'Filtra pelo status da candidatura' })
  @IsOptional()
  @IsEnum(JobApplicationStatus)
  status?: JobApplicationStatus;

  @ApiPropertyOptional({ description: 'Filtra por ID da cidade' })
  @IsOptional()
  @IsString()
  cityId?: string;

  @ApiPropertyOptional({ description: 'Filtra por ID do distrito' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Filtra por ID da posição desejada' })
  @IsOptional()
  @IsString()
  desiredPositionId?: string;

  @ApiPropertyOptional({ description: 'Filtra por ID do gênero' })
  @IsOptional()
  @IsString()
  genderId?: string;

  @ApiPropertyOptional({ description: 'Filtra por ID do grau de escolaridade mais elevado' })
  @IsOptional()
  @IsString()
  highestDegreeId?: string;

  // --- NOVOS CAMPOS PARA FILTRAR POR DATA DE CRIAÇÃO ---
  @ApiPropertyOptional({ description: 'Data de início para filtrar candidaturas criadas a partir desta data (ISO 8601)', type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString() // Valida que a string é uma data ISO 8601 válida
  createdAtStart?: string;

  @ApiPropertyOptional({ description: 'Data de fim para filtrar candidaturas criadas até esta data (ISO 8601)', type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString() // Valida que a string é uma data ISO 8601 válida
  createdAtEnd?: string;
  // --- FIM DOS NOVOS CAMPOS ---

  @ApiPropertyOptional({ description: 'Número da página', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Limite de resultados por página', minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}