import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsEnum, IsArray } from 'class-validator';
import { GeneralAvailability, ExperienceLevel } from './create-professional.dto';

export class FilterProfessionalDto {
  @ApiPropertyOptional({ example: 'Isaac', description: 'Nome do profissional' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '7c1f0a7e-1f4d-4c67-9f3c-0f85eae98760', description: 'ID da cidade' })
  @IsOptional()
  @IsUUID()
  cityId?: string;

  @ApiPropertyOptional({ example: 'a3cf502a-1215-4574-8b89-3de20b51524b', description: 'ID do distrito' })
  @IsOptional()
  @IsUUID()
  districtId?: string;

  @ApiPropertyOptional({ enum: GeneralAvailability, example: GeneralAvailability.FULL_TIME, description: 'Tipo de disponibilidade' })
  @IsOptional()
  @IsEnum(GeneralAvailability)
  availabilityType?: GeneralAvailability;

  @ApiPropertyOptional({ enum: ExperienceLevel, example: ExperienceLevel.THREE_TO_FIVE, description: 'Nível de experiência' })
  @IsOptional()
  @IsEnum(ExperienceLevel)
  experienceLevel?: ExperienceLevel;

  @ApiPropertyOptional({
    example: ['23c1b774-2f33-4b90-8f83-874cbd02d9e5'],
    type: [String],
    description: 'Lista de IDs de especialidades',
  })
  @IsOptional()
  @IsArray()
  specialtyIds?: string[];
}
