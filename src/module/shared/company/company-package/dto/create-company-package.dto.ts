import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
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
    example: '2024-01-01T00:00:00.000Z', // ou '2024-01-01'
    type: String, // Explicitly set type to String for Swagger UI date picker
    format: 'date-time', // For Swagger UI to show date/time picker
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'Data de fim do contrato (formato ISO 8601, ex: YYYY-MM-DD).',
    example: '2024-12-31T23:59:59.999Z', // ou '2024-12-31'
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

}