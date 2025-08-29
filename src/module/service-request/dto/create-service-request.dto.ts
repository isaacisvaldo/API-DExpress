// src/service-request/dto/create-service-request.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, ServiceFrequency } from '@prisma/client';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { IsValidEmail } from 'src/common/validators/is-valid-email';

export class CreateServiceRequestDto {
  @ApiProperty({
    enum: UserType,
    description: 'Tipo de requerente: PESSOA_NORMAL ou EMPRESA',
    example: UserType.INDIVIDUAL,
  })
  @IsEnum(UserType)
  @IsNotEmpty()
  requesterType: UserType;

  @ApiProperty({
    description: 'Email de contacto do requerente',
    example: 'solicitante@email.com',
  })
  @IsEmail()
   @IsValidEmail() 
  @IsNotEmpty()
  requesterEmail: string;

  @ApiPropertyOptional({
    description: 'Número de telefone do requerente (opcional)',
    example: '912345678',
  })
  @IsString()
  @IsOptional()
  requesterPhoneNumber?: string;

  // --- Dados Específicos para PESSOA_NORMAL ---
  @ApiPropertyOptional({
    description: 'Nome completo da pessoa normal (necessário se requesterType for PESSOA_NORMAL)',
    example: 'Ana Maria Silva',
  })
  @ValidateIf((o) => o.requesterType === UserType.INDIVIDUAL)
  @IsNotEmpty()
  @IsString()
  individualRequesterName?: string;

  @ApiPropertyOptional({
    description: 'Número de identificação da pessoa normal (necessário se requesterType for PESSOA_NORMAL)',
    example: '123456789AZ0',
  })
  @ValidateIf((o) => o.requesterType === UserType.INDIVIDUAL)
  @IsNotEmpty()
  @IsString()
  individualIdentityNumber?: string;

  @ApiPropertyOptional({
    description: 'Endereço da pessoa normal (necessário se requesterType for PESSOA_NORMAL)',
    example: 'Rua das Flores, 10, Lisboa',
  })
  @ValidateIf((o) => o.requesterType === UserType.INDIVIDUAL)
  @IsNotEmpty()
  @IsString()
  individualAddress?: string;

  @ApiPropertyOptional({
    description: 'ID do utilizador logado que faz a solicitação (se aplicável)',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsOptional()
  individualUserId?: string;

  // --- Dados Específicos para EMPRESA ---
  @ApiPropertyOptional({
    description: 'Nome da empresa (necessário se requesterType for EMPRESA)',
    example: 'Tech Solutions Lda.',
  })
  @ValidateIf((o) => o.requesterType === UserType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  companyRequesterName?: string;

  @ApiPropertyOptional({
    description: 'NIF da empresa (necessário se requesterType for EMPRESA)',
    example: '500123456',
  })
  @ValidateIf((o) => o.requesterType === UserType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  companyNif?: string;

  @ApiPropertyOptional({
    description: 'Endereço da empresa (necessário se requesterType for EMPRESA)',
    example: 'Avenida da Liberdade, 100, Porto',
  })
  @ValidateIf((o) => o.requesterType === UserType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  companyAddress?: string;

  @ApiPropertyOptional({
    description: 'ID do Distrito da empresa (necessário se requesterType for EMPRESA)',
    example: 'distrito-uuid-exemplo',
  })
  @ValidateIf((o) => o.requesterType === UserType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  companyDistrictId?: string;

  @ApiPropertyOptional({
    description: 'ID do Setor da empresa (necessário se requesterType for EMPRESA)',
    example: 'setor-uuid-exemplo',
  })
  @ValidateIf((o) => o.requesterType === UserType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  companySectorId?: string;

  // --- Detalhes da Solicitação ---
  @ApiProperty({
    description: 'Descrição detalhada do serviço solicitado',
    example: 'Necessito de desenvolvimento de uma aplicação web personalizada para gestão de clientes.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: ServiceFrequency,
    description: 'Frequência do serviço: Mensal, Bimestral, Trimestral, Semestral, Anual ou Bienal.',
    example: ServiceFrequency.QUARTERLY,
  })
  @IsEnum(ServiceFrequency)
  @IsNotEmpty()
  serviceFrequency: ServiceFrequency;
  
  // --- Campos para a Contratação ---
  @ApiPropertyOptional({
    description: 'ID do plano de serviço desejado (apenas se requesterType for EMPRESA)',
    example: 'plano-uuid-exemplo',
  })
  @ValidateIf((o) => o.requesterType === UserType.CORPORATE)
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiPropertyOptional({
    description: 'ID do profissional desejado (apenas se requesterType for PESSOA_NORMAL)',
    example: 'profissional-uuid-exemplo',
  })
  @ValidateIf((o) => o.requesterType === UserType.INDIVIDUAL)
  @IsString()
  @IsOptional()
  professionalId?: string;
}