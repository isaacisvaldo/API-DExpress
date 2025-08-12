// src/sector/dto/create-sector.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSectorDto {
  @ApiProperty({
    description: 'The unique name of the sector (e.g., "TECNOLOGIA").',
    example: 'TECNOLOGIA',
  })
  @IsNotEmpty({ message: 'O nome do setor é obrigatório.' })
  @IsString({ message: 'O nome do setor deve ser uma string.' })
  @MaxLength(50, { message: 'O nome do setor não pode ter mais de 50 caracteres.' })
  name: string;

  @ApiProperty({
    description: 'A human-readable label for the sector (e.g., "Tecnologia").',
    example: 'Tecnologia',
  })
  @IsNotEmpty({ message: 'O label do setor é obrigatório.' })
  @IsString({ message: 'O label do setor deve ser uma string.' })
  @MaxLength(100, { message: 'O label do setor não pode ter mais de 100 caracteres.' })
  label: string;
}

