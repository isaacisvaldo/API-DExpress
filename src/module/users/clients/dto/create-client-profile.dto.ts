// src/client/dto/create-client-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEmail } from 'class-validator';

export class CreateClientProfileDto {
  @ApiProperty({ example: 'Isaac Bunga' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'isaac@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+244923456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: ['+244911223344'], type: [String] })
  @IsArray()
  optionalContacts: string[];

  @ApiProperty({ example: 'Rua Principal, Bairro XYZ' })
  @IsString()
  address: string;
}
