import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  Min,
  IsNotEmpty,
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
    description: 'Horas de trabalho incluídas no pacote',
    example: 8,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  hours: number;

  @ApiProperty({
    description: 'Custo total do pacote',
    example: 150.00,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  cost: number;

  @ApiProperty({
    description: 'Percentagem (ex: 0.25 para 25%)',
    example: 0.25,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  percentage: number;

  @ApiProperty({
    description: 'Salário base por funcionário',
    example: 50.00,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  equivalent: number;

  @ApiProperty({
    description: 'Salário base geral',
    example: 100.00,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  baseSalary: number;

  @ApiProperty({
    description: 'Total do saldo final do serviço',
    example: 200.00,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalBalance: number;

  @ApiProperty({
    description: 'Indica se o pacote está ativo',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}