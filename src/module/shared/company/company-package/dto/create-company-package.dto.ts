import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber, // Importe IsNumber para validar números
  IsOptional,
} from 'class-validator';

export class CreateCompanyPackageDto {
  @ApiProperty({
    description: 'O ID do perfil da empresa cliente associado a este pacote.',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @IsString()
  @IsNotEmpty()
  clientCompanyProfileId: string;

  @ApiProperty({
    description: 'O ID do pacote de serviço associado a este contrato.',
    example: 'x1y2z3a4-b5c6-7d8e-9f0g-h1i2j3k4l5m6',
  })
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty({
    description: 'Data de início do contrato (formato ISO 8601, ex: YYYY-MM-DD).',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'Data de fim do contrato (formato ISO 8601, ex: YYYY-MM-DD).',
    example: '2024-12-31T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    description: 'Valor acordado para o contrato.',
    example: 1500.50,
  })
  @IsNumber()
  @IsNotEmpty()
  agreedValue: number;

  @ApiProperty({
    description: 'Percentual de desconto aplicado ao valor acordado.',
    example: 10.0,
    required: false,
    default: 0.0,
  })
  @IsNumber()
  @IsOptional()
  discountPercentage: number;

  @ApiProperty({
    description: 'Valor final a ser pago após o desconto.',
    example: 1350.45,
  })
  @IsNumber()
  @IsNotEmpty()
  finalValue: number;
}