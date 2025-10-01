import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateClientProfileDto {
  @ApiProperty({
    description: 'O nome Primeiro Nome do Cliente.',
    example: 'João',
  })
  @IsNotEmpty({ message: 'O Primeiro Nome é Obrigatorio.' })
  @IsString({ message: 'O Primeiro Nome deve ser uma string.' })
  firstName: string;
@IsNotEmpty({ message: 'O Ultimo Nome é Obrigatorio.' })  
@IsString({ message: 'O Ultimo Nome deve ser uma string.' })
  @ApiProperty({
    description: 'O sobrenome do cliente.',
    example: 'Silva',
  })
  lastName: string;
  @ApiProperty({
    description: 'O endereço de e-mail do cliente. Deve ser único.',
    example: 'joao.silva@example.com',
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Formato de e-mail inválido.' })
  email: string;

  @ApiProperty({
    description: 'O número de identificação do cliente (ex: BI).',
    example: '001234567LA009',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'O número de identificação deve ser uma string.' })
  identityNumber: string;

  @ApiProperty({
    description: 'O número de telefone principal do cliente.',
    example: '+244923456789',
  })
  @IsNotEmpty({ message: 'O número de telefone é obrigatório.' })
  @IsString({ message: 'O número de telefone deve ser uma string.' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Uma lista de números de contato opcionais.',
    example: ['+244911223344', '+244933445566'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Os contatos opcionais devem ser um array de strings.' })
  @IsString({ each: true, message: 'Cada contato opcional deve ser uma string.' })
  optionalContacts: string[];

  @ApiProperty({
    description: 'O endereço físico do cliente.',
    example: 'Rua das Flores, Luanda',
  })
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  @IsString({ message: 'O endereço deve ser uma string.' })
  address: string;


  @ApiProperty({
    description: 'A senha temporária do cliente para o primeiro acesso.',
    example: 'Senha@1234',
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  password?: string;
}