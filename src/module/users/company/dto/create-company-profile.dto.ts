// src/company/dto/create-company-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCompanyProfileDto {
  @ApiProperty({ example: 'Minha Empresa LDA' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  nif: string;

  @ApiProperty({ example: '+244923456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '+244911223344', required: false })
  @IsOptional()
  @IsString()
  optionalContact?: string;

  @ApiProperty({ example: 'empresa@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Rua do Comércio, Luanda' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Ativo' })
  @IsString()
  state: string;
}
