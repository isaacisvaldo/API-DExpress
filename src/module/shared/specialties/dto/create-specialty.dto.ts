// src/specialty/dto/create-specialty.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Limpeza' })
  @IsString()
  name: string;
}