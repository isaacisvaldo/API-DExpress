import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceFrequency, UserType, ContractStatus } from '@prisma/client';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterContractDto {
  @ApiPropertyOptional({
    description: 'Filtra por título do contrato (busca insensível a maiúsculas/minúsculas).',
    example: 'Consultoria',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Filtra por tipo de cliente.',
    enum: UserType,
  })
  @IsOptional()
  @IsEnum(UserType)
  clientType?: UserType;

  @ApiPropertyOptional({
    description: 'Filtra por ID do profissional. Pode ser um único ID ou uma lista de IDs.',
    example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsUUID('all', { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  professionalIds?: string[];

  @ApiPropertyOptional({
    description: 'Filtra por ID de localização.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({
    description: 'Filtra por ID de pacote.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  packageId?: string;
  
  @ApiPropertyOptional({
    description: 'Filtra por frequência do serviço.',
    enum: ServiceFrequency,
  })
  @IsOptional()
  @IsEnum(ServiceFrequency)
  serviceFrequency?: ServiceFrequency;

  @ApiPropertyOptional({
    description: 'Filtra por status do contrato.',
    enum: ContractStatus,
  })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiPropertyOptional({
    description: 'O número da página para a paginação.',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @ApiPropertyOptional({
    description: 'O limite de itens por página.',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}
