import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidEmail } from 'src/common/validators/is-valid-email';

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
  @IsValidEmail()
  email: string;

  @ApiPropertyOptional({ example: 'senhaForte123', description: 'Senha (opcional, gerada se não enviada)' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;


  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'ID do perfil a ser associado ao administrador' })
  @IsUUID()
  @IsNotEmpty()
  profileId: string; // ✅ Campo para o ID do perfil, agora obrigatório

  // ❌ O campo 'permissions' foi removido
}
