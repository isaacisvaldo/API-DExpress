// src/module/admin-auth/dto/admin-login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@dexpress.com', description: 'Email do administrador' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin123!', description: 'Senha do administrador' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
