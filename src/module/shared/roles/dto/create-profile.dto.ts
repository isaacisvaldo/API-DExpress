import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: 'GENERAL_ADMIN',
    description: 'Nome único do perfil (ex: ADMIN_GERAL)',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Administrador Geral',
    description: 'Título ou label do perfil para exibição na interface',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiPropertyOptional({
    example: 'Perfil com acesso total ao sistema.',
    description: 'Descrição opcional do perfil',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: [String],
    example: ['CREATE_ADMIN', 'VIEW_REPORTS', 'MANAGE_USERS'],
    description: 'Lista de nomes de permissões a serem associadas a este perfil',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
