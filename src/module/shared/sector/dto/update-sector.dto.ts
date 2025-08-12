// src/sector/dto/update-sector.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateSectorDto } from './create-sector.dto';

export class UpdateSectorDto extends PartialType(CreateSectorDto) {
  @ApiProperty({
    description: 'A new unique name for the sector (e.g., "SOFTWARE_E_TI").',
    example: 'SOFTWARE_E_TI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O nome do setor deve ser uma string.' })
  @MaxLength(50, { message: 'O nome do setor não pode ter mais de 50 caracteres.' })
  name?: string;

  @ApiProperty({
    description: 'A new human-readable label for the sector (e.g., "Software e TI").',
    example: 'Software e TI',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O label do setor deve ser uma string.' })
  @MaxLength(100, { message: 'O label do setor não pode ter mais de 100 caracteres.' })
  label?: string;
}