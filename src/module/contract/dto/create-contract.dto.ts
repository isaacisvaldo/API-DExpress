import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
  IsUUID,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateIf,
} from 'class-validator';
import { ServiceFrequency, UserType } from '@prisma/client';

/**
 * DTO para criar um novo contrato.
 */
export class CreateContractDto {
  @ApiPropertyOptional({
    description: 'O título do contrato.',
    example: 'Contrato de Consultoria de Software',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'O ID do profissional associado ao contrato (usado para clientes INDIVIDUAIS).',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => o.clientType === UserType.INDIVIDUAL)
  @IsNotEmpty({
    message: 'professionalId é obrigatório para clientes INDIVIDUAIS.',
  })
  professionalId?: string;

  @ApiPropertyOptional({
    description: 'Os IDs dos profissionais associados ao contrato (usado para clientes EMPRESARIAIS).',
    example: ['f47ac10b-58cc-4372-a567-0e02b2c3d479', 'b123c456-78de-901f-2a34-b56789cdefab'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayNotEmpty({
    message: 'professionalIds não pode ser vazio para clientes EMPRESARIAIS.',
  })
  @ValidateIf((o) => o.clientType === UserType.CORPORATE)
  professionalIds?: string[];

  @ApiProperty({
    description: 'O tipo de cliente.',
    enum: UserType,
    example: UserType.INDIVIDUAL,
  })
  @IsNotEmpty()
  @IsEnum(UserType)
  clientType: UserType;

  @ApiPropertyOptional({
    description: 'O ID do cliente individual, se o clientType for INDIVIDUAL.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => o.clientType === UserType.INDIVIDUAL)
  @IsNotEmpty({
    message: 'individualClientId é obrigatório para clientes INDIVIDUAIS.',
  })
  individualClientId?: string;

  @ApiPropertyOptional({
    description: 'O ID da empresa cliente, se o clientType for COMPANY.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsOptional()
  @IsUUID()
  @ValidateIf((o) => o.clientType === UserType.CORPORATE)
  @IsNotEmpty({
    message: 'companyClientId é obrigatório para clientes EMPRESARIAIS.',
  })
  companyClientId?: string;

  @ApiPropertyOptional({
    description: 'O ID do pacote de serviço adquirido.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  packageId?: string;

  @ApiPropertyOptional({
    description: 'O ID da posição desejada para o serviço.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsOptional()
  @IsUUID()
  desiredPositionId?: string;

  @ApiProperty({
    description: 'Uma descrição detalhada do serviço.',
    example: 'Desenvolvimento de uma aplicação web para gerenciamento de projetos.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;


  @ApiProperty({
    description: 'O ID da localização do serviço.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsNotEmpty()
  @IsUUID()
  locationId: string;

  @ApiProperty({
    description: 'O valor acordado para o contrato.',
    example: 5000.0,
  })
  @IsNotEmpty()
  @IsNumber()
  agreedValue: number;

  @ApiPropertyOptional({
    description: 'A porcentagem de desconto aplicada (opcional, padrão 0.0).',
    example: 10.0,
    default: 0.0,
  })
  @IsOptional()
  @IsNumber()
  discountPercentage?: number;

  @ApiProperty({
    description: 'O valor final do contrato após descontos.',
    example: 4500.0,
  })
  @IsNotEmpty()
  @IsNumber()
  finalValue: number;

  @ApiPropertyOptional({
    description: 'Os termos de pagamento em texto livre.',
    example: '50% na assinatura e 50% na conclusão do projeto.',
  })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty({
    description: 'A data de início do contrato.',
    example: '2023-10-27T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({
    description: 'A data de término do contrato (opcional).',
    example: '2024-10-27T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Notas adicionais sobre o contrato.',
    example: 'O cliente solicitou uma reunião de acompanhamento semanal.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
