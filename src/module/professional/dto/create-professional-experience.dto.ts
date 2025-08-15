// src/module/professional/dto/create-professional-experience.dto.ts

import {
  IsString,
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
}