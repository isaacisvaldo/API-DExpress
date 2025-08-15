// src/company/dto/create-company-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCompanyProfileDto {
  @ApiProperty({
    description: 'O nome legal da empresa.',
    example: 'Minha Empresa LDA',
  })
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
  @IsString({ message: 'O nome da empresa deve ser uma string.' })
  companyName: string;

  @ApiProperty({
    description: 'O Número de Identificação Fiscal (NIF) da empresa.',
    example: '1234567890',
  })
  @IsNotEmpty({ message: 'O NIF é obrigatório.' })
  @IsString({ message: 'O NIF deve ser uma string.' })
  @MaxLength(20, { message: 'O NIF não pode ter mais de 20 caracteres.' })
  nif: string;

  @ApiProperty({
    description: 'O endereço de e-mail da empresa.',
    example: 'empresa@email.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  email: string;

  @ApiProperty({
    description: 'O número de telefone principal da empresa.',
    example: '+244923456789',
  })
  @IsNotEmpty({ message: 'O número de telefone é obrigatório.' })
  @IsString({ message: 'O número de telefone deve ser uma string.' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Um número de telefone de contato opcional.',
    example: '+244911223344',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O contato opcional deve ser uma string.' })
  optionalContact?: string;

  @ApiProperty({
    description: 'O endereço físico da sede da empresa.',
    example: 'Rua do Comércio, Luanda',
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço deve ser uma string.' })
  address: string;

  @ApiProperty({
    description: 'O ID do setor de atividade da empresa.',
    example: 'uuid-do-sector',
  })
  @IsNotEmpty({ message: 'O ID do setor é obrigatório.' })
  @IsUUID('4', { message: 'O ID do setor deve ser um UUID válido.' })
  sectorId: string;

  @ApiProperty({
    description: 'O ID do distrito onde a empresa está localizada.',
    example: 'uuid-do-distrito',
  })
  @IsNotEmpty({ message: 'O ID do distrito é obrigatório.' })
  @IsUUID('4', { message: 'O ID do distrito deve ser um UUID válido.' })
  districtId: string;
}