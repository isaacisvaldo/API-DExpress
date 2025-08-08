import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray, IsUUID, IsEnum, IsBoolean } from 'class-validator';
import { InternalRole } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do administrador' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+244912345678', description: 'Número de telefone do administrador' })
  @IsString()
  numberphone: string;

  @ApiProperty({ example: '123456789LA045', description: 'Número de identidade único' })
  @IsString()
  @IsNotEmpty()
  identityNumber: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID do gênero (UUID)' })
  @IsUUID()
  genderId: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z', description: 'Data de nascimento (ISO)' })
  @IsNotEmpty()
  @Type(() => Date)
  birthDate: Date;

  @ApiProperty({ example: 'admin@dexpress.com', description: 'Email único do administrador' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'senhaForte123', description: 'Senha (opcional, gerada se não enviada)' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ enum: InternalRole, example: InternalRole.OPERATIONS_MANAGER, description: 'Cargo interno' })
  @IsEnum(InternalRole)
  role: InternalRole;

  @ApiPropertyOptional({ type: [String], example: ['CREATE_USER', 'VIEW_REPORTS'], description: 'Lista de permissões (opcional)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
