// src/module/professional/dto/create-professional-experience.dto.ts

import {
  IsString,
  IsOptional, // Importe este decorador
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfessionalExperienceDto {
  @ApiProperty({ example: 'Empresa ABC', description: 'Nome do local de trabalho.' })
  @IsString()
  localTrabalho: string;

  @ApiProperty({ example: 'Gerente de Vendas', description: 'Cargo exercido.' })
  @IsString()
  cargo: string;

  @ApiProperty({ example: '3 anos', description: 'Duração da experiência.' })
  @IsString()
  tempo: string;

  @ApiProperty({ example: 'Responsabilidades e conquistas na função.', description: 'Descrição da experiência.', required: false })
  @IsOptional()
  @IsString()
  description?: string; // Adicione o '?' aqui

  @ApiProperty({ example: 'YYYY-MM-DD', description: 'Data de início.', required: false })
  @IsOptional()
  @IsString()
  startDate?: string; // Adicione o '?' aqui

  @ApiProperty({ example: 'YYYY-MM-DD', description: 'Data de término.', required: false })
  @IsOptional()
  @IsString()
  endDate?: string; // Adicione o '?' aqui
}