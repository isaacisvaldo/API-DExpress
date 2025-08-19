import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  Min,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({
    description: 'Nome do pacote, ex: "Pacote Limpeza Essencial"',
    example: 'Pacote Limpeza Essencial',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição opcional do pacote',
    required: false,
    example: 'Este pacote oferece uma limpeza completa para sua casa.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Número de funcionários necessários para o pacote',
    example: 2,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  employees: number;

  @ApiProperty({
    description: 'Custo total do pacote',
    example: 150.00,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;
  @ApiProperty({
    description: 'Itens inclusos neste pacote',
    example: ['Limpeza de pisos', 'Limpeza de banheiros'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details: string[];
}