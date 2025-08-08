import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateAdminUserDto } from './create-admin-user.dto.ts';

// ✅ PartialType torna todas as propriedades de CreateAdminUserDto opcionais.
export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {
  @ApiPropertyOptional({ description: 'Ativar ou desativar o utilizador' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}